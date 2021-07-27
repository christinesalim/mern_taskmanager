const jwt = require ('jsonwebtoken');
const User = require('../models/user')
const auth = async ( req, res, next) => {
  try {
    console.log("req header", req.header('Authorization'));
    //Remove the "Bearer " string from the auth token
    const token = req.header('Authorization').replace('Bearer ','');
    console.log("token", token);

    //We can login user through google login or email/password
    //Google's token > 500 in length; JWT token is shorter
    const isCustomToken = token.length < 500;

    let decoded, user;
    let userId = null;
    //For JWT tokens
    if (isCustomToken){

      //Get the decoded payload using the same secret
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded?._id;
      console.log("In auth userId", userId, token);
      if(userId){      
    
        user = await User.findOne({ _id: userId , 'tokens.token': token });
  
        if (!user){
          console.log("No user found in server database; throwing error")
          throw new Error();
        }
        //Give route handler the database user we found so they don't have
        //to find user again
        req.user = user;
        //Save the token used to authenticate this user
        req.token = token;
      }
    } else{
      //decode Google token
      decoded = jwt.decode(token);      
      console.log(decoded);

      //Get the user using the sub field from the decoded token. It contains the userId
      //Note Google's tokens expire in an hour
     
      // req[gapiProfile] = decoded;
      const user = new User({firstName: decoded.name, lastName: decoded.lastName, email: decoded.email});
     
      //Create token when new user is created
      const jwtToken = await user.generateAuthToken();
      
      //Save the new user to the users collection
      await user.save();
      
      
      req.user = user;
      req.token = jwtToken;
      console.log("Saved gapi user to database", req);
    
  
    }
    //Continue running the next command which is the route handler
    next();

  }catch (e) {
    console.log(e);
    res.status(401).send({ error: 'Please authenticate.' });
  }
}

module.exports = auth;