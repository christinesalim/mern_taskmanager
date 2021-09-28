const User = require('../models/user');
const { admin, firebase } = require('./firebase');

//Auth check using token ID from firebase login on client side
const checkAuth = async (req, res, next) => {

  //Remove the "Bearer " string from the auth token
  let authToken = null;

  if (req.header('Authorization')) {
    authToken = req.header('Authorization').replace('Bearer ', '');
  } else {
    res.status(403).send('Unauthorized - no Bearer token');
  }

  //console.log('checkAuth: firebase token', authToken);

  try {
    const decodedToken = await admin.auth().verifyIdToken(authToken);
    console.log('Decoded token verified', decodedToken);
    req.email = decodedToken.email;

    //Find the user in the database using their email from the decoded token
    const user = await User.findByEmail(req.email);
    console.log('checkauth found user by email', user);

    req.user = user;
    next();

  } catch (e) {
    console.log(e);
    console.log('Sending 403 status: unauthorized user - email');
    res.status(403).send('Unauthorized user');
  }
}


module.exports = { checkAuth };