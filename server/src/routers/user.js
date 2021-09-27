const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const { auth, checkAuth } = require('../middleware/auth');

const { sendWelcomeEmail, sendCancelEmail } =
  require('../emails/account');
const router = new express.Router();

//Creating a new user - signing up
//Route handler: POST /users
router.post('/users', async (req, res) => {
  console.log("Received POST /users ", req.body);

  try {
    const user = new User(req.body);

    console.log('req.body: ', req.body);
    console.log("Mongo db user", user);
    //Save the new user to the users collection
    await user.save();

    const name = user.firstName + ' ' + user.lastName;
    sendWelcomeEmail(user.email, name);

    res.status(201).send({ user }); //201 - indicates resource was created

  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  };
});

//Login an existing user into the backend database
//Route handler: /users/login'
router.put('/users/login', checkAuth, async (req, res) => {
  console.log("Received /users/login endpoint", req.body);

  try {

    //Client sent ID token from firebase. After validating token in 
    //middleware, look up this user by email and password and send 
    //info to client
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password);
    console.log('Found user ', user);
    res.send({ user });
  } catch (e) {
    res.status(400).send(e);
  }
});

//Login an existing user into the backend database. No password is
//sent.
//Route handler: /users/login/email'
router.put('/users/login/email', checkAuth, async (req, res) => {
  console.log("/users/login endpoint");
  console.log('payload:', req.body);
  try {

    //Client sent ID token from firebase. After validating token in 
    //middleware which also looked up this user send their 
    //info to client
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});



//Login a google authenticated user
//Route handler: /users/googlelogin'
router.get('/users/googlelogin', async (req, res) => {
  console.log('In route /users/googlelogin');
  try {
    return res.json({
      todos: [
        { title: 'Task 1' },
        { title: 'Task 2' }
      ]
    });

  } catch (e) {
    console.log('/users/googlelogin error', e);
  };
});



//Logout a user
//Route handler 
router.post('/users/logout', checkAuth, async (req, res) => {

  res.send();
});

//Logout user from all sessions
router.post('/users/logoutAll', checkAuth, async (req, res) => {
  try {
    //Remove all the tokens from the list
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
})

//Route handler: GET /users/me
//Allow user to get their own profile
//Authentication function is the middleware used 2nd argument
//Our function 3rd argument
router.get('/users/me', checkAuth, async (req, res) => {
  try {
    //Send the profile to the user
    res.send(req.user);
  } catch (e) {
    res.status(401).send();
  }
});

//Route handler: GET /users/id
router.get('/users/:id', async (req, res) => {
  //Get the ID sent in the request
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

//Route handler: PATCH 
//Update the currently authenticated user
router.patch('/users/me', checkAuth, async (req, res) => {

  //Property names in message body
  const updates = Object.keys(req.body);

  //Valid property names
  const allowedUpdates = ['firstName', 'lastName', 'email', 'password', 'age'];

  //Check if every properties to update is valid
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    console.log("Invalid property update");
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {

    //User object is saved with the request
    updates.forEach(update => req.user[update] = req.body[update]);

    //Save the user and hash the password; Mongoose will call pre()  
    //that is defined in the User schema
    await req.user.save();

    //console.log("Success", user);
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});

//Route handler: DELETE 
//Delete the authenticated user
router.delete('/users/me', checkAuth, async (req, res) => {
  try {
    //Removes this user document from the collection
    await req.user.remove();
    //Send the cancel email with sendgrid
    const name = req.user.firstName + ' ' + req.user.lastName;
    sendCancelEmail(req.user.email, name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

//Setup multer middleware to upload user profile image
const upload = multer({
  //Take out destination directory so multer returns it
  //instead of storing it
  //dest: 'avatars', //destination folder for image uploaded

  limits: { //limit options
    fileSize: 1000000 //1MB limit to profile picture
  },
  //filter file by type
  fileFilter(req, file, cb) {
    //cb - callback to send results to caller
    //first argument indicates error, second argument indicates if 
    //file was accepted
    const fileExtensions = ['jpg', 'jpeg', 'png'];
    const isValidFile = fileExtensions.some(ext => {
      return file.originalname.endsWith(ext);
    })
    if (!isValidFile) {
      return cb(new Error("Please upload JPG, JPEG or PNG file"));
    }
    cb(undefined, true); //no error, file was uploaded
  }
});

//Use upload.single middleware from multer library with key 'avatar'
//Route handler: POST /users/id/avatar
router.post('/users/me/avatar',
  checkAuth, //authenticate user
  upload.single('avatar'),
  async (req, res) => {
    console.log("Received user's avatar");
    //User sharp npm module to convert image buffer
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {

    console.log(error);
    console.log()

    //handle error from multer
    res.status(400).send({ error: error.message });
  });


//DELETE /users/me/avatar
router.delete('/users/me/avatar', checkAuth, async (req, res) => {
  //Clear the avatar field

  console.log("***Received delete avatar request");
  req.user.avatar = undefined;
  try {
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//GET /users/:id/avatar
router.get('/users/:id/avatar', async (req, res) => {
  try {
    console.log("****Get avatar request received for ", req.params.id);
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error('Cannot find user or avatar');
    }
    //We reformat and convert to png when we receive avatar
    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
    console.log("Sent user avatar to client");
  } catch (e) {
    res.status(404).send(e);
  }
})

module.exports = router;