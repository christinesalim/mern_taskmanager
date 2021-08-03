const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelEmail } = 
  require('../emails/account');
const router = new express.Router();

//OAUTH2 client to login google users
const client = new OAuth2Client(process.env.CLIENT_ID);

//Creating a new user - signing up
//Route handler: POST /users
router.post('/users', async (req,res)=> {
  const user = new User(req.body);
  try {
    //Save the new user to the users collection
    await user.save();
    const name = user.firstName + ' ' + user.lastName;
    sendWelcomeEmail( user.email, name);
    //Create token when new user is created
    const jwtToken = await user.generateAuthToken();
    res.status(201).send({ user, jwtToken }); //201 - indicates resource was created
    
  } catch (e) {
    res.status(400).send(e);
  };  
});

//Login a user
//Route handler: /users/login'
router.post('/users/login', async(req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, 
      req.body.password);
    //Generate new token after logging in
    const jwtToken = await user.generateAuthToken();
    res.send({ user, jwtToken });
  }catch (e){
    res.status(400).send();
  }
});

//Login a google authenticated user
//Route handler: /users/googlelogin'
router.post('/users/googlelogin', async(req, res) => {
  try {
    console.log("Googlelogin endpoint", req.body);
  
    //Get the OAuth2 token
    const { token } = req.body;
    console.log("token", token);
    //Verify the user's token is valid
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
    });

    const payload = ticket.getPayload();
    console.log("token payload", payload);

  
    if (payload.email_verified){
      let user = await User.findOne({email: payload.email});
      let jwtToken = null;
      if (user){ //found user in our database
        console.log("Found user");
        //Generate new jwt token after logging in
        jwtToken = await user.generateAuthToken();
        
      } else {
        //user not in the database so add them
        console.log("Adding user to db");
        const nameArr = payload.name.split(" ");

        user = new User ({ 
          firstName: nameArr[0],
          lastName: nameArr[1],
          email: payload.email
        });
        await user.save();
        //Generate new token after adding user to database
        jwtToken = await user.generateAuthToken();
      }
      //Send database user and token
      console.log("Sending user and token", user, jwtToken);
      res.send({ user, jwtToken });
    }else {
      console.log("Email not verified");
      throw new Error("Unverified google account");
    }
    
  }catch (e){
    console.log("Error", e);
    res.status(400).send();
  }
});



//Logout a user
//Route handler 
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      //When we authenticated user, we saved the token we 
      //received; remove that token from the user's list of 
      //tokens since the user is logging out
      return token.token !== req.token;
    })
    //Save the user document with the modified token list
    await req.user.save();
    
    res.send();
  } catch(e) {
    res.status(500).send();
  }
});

//Logout user from all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    //Remove all the tokens from the list
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e){
    res.status(500).send();
  }
})

//Route handler: GET /users/me
//Allow user to get their own profile
//Authentication function is the middleware used 2nd argument
//Our function 3rd argument
router.get('/users/me', auth, async (req, res) => {
  try {
    //Send the profile to the user
    res.send(req.user);  
  } catch (e){
    res.status(401).send();
  }
});

//Route handler: GET /users/id
router.get('/users/:id', async (req, res) => {
  //Get the ID sent in the request
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user){
      return res.status(404).send();
    }
    res.send(user);
  }catch(e) {
    res.status(500).send(e);
  }
});

//Route handler: PATCH 
//Update the currently authenticated user
router.patch('/users/me', auth, async (req, res) => {
  
  //Property names in message body
  const updates = Object.keys(req.body);

  //Valid property names
  const allowedUpdates = ['firstName', 'lastName', 'email', 'password', 'age'];
  
  //Check if every properties to update is valid
  const isValidOperation = updates.every( update => allowedUpdates.includes(update));

  if (!isValidOperation){
    console.log("Invalid property update");
    return res.status(400).send({error: "Invalid updates" });
  }

  try {
   
    //User object is saved with the request
    updates.forEach( update => req.user[update] = req.body[update]);

    //Save the user and hash the password; Mongoose will call pre()  
    //that is defined in the User schema
    await req.user.save();

    //console.log("Success", user);
    res.send (req.user);
  }catch (e) {
    res.status(400).send();
  }
});

//Route handler: DELETE 
//Delete the authenticated user
router.delete ('/users/me', auth, async (req, res) => {
  try {
    //Removes this user document from the collection
    await req.user.remove();
    //Send the cancel email with sendgrid
    const name = req.user.firstName + ' ' + req.user.lastName;
    sendCancelEmail(req.user.email, name);
    res.send(req.user);
  }catch (e){
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
  fileFilter(req, file, cb){ 
    //cb - callback to send results to caller
    //first argument indicates error, second argument indicates if 
    //file was accepted
    const fileExtensions = ['jpg', 'jpeg', 'png'];
    const isValidFile = fileExtensions.some(ext => {
      return file.originalname.endsWith(ext);
    })
    if (!isValidFile){
      return cb(new Error("Please upload JPG, JPEG or PNG file"));
    }
    cb(undefined, true); //no error, file was uploaded
  }
});

//Use upload.single middleware from multer library with key 'avatar'
//Route handler: POST /users/id/avatar
router.post('/users/me/avatar', 
  auth, //authenticate user
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
router.delete('/users/me/avatar', auth, async (req, res) => {
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
    if (!user || !user.avatar){
      throw new Error();
    }
    //We reformat and convert to png when we receive avatar
    res.set('Content-Type','image/png');
    res.send(user.avatar);
    console.log("Sent user avatar to client");
  }catch (e) {
    res.status(404).send();
  }
})

module.exports = router;