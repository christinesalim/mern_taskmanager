const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

//Create schema for User
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true, //using mongoose built-in validation 
    trim: true //remove white space
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, //only one email 
    trim: true,
    lowercase: true,
    validate(value) {
      //Use validator package for email validation
      if (!validator.isEmail(value)) {
        throw new Error('Email is not valid');
      }
    }
  },
  // password: {
  //   type: String,
  //   //required: true, //with gapi we don't get password
  //   minLength: 7,
  //   trim: true,
  //   validate(value) {
  //     if (value.toLowerCase().includes('password')) {
  //       throw new Error('Password cannot contain "password"');
  //     }
  //   }
  // },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true //option to get timestamp for createdAt and upatedAt
});

//Virtual field 'tasks': not stored in database
//This virtual field allows us to get all tasks for a user
userSchema.virtual('tasks', {
  ref: 'Task', //reference Task model
  localField: '_id', //Find tasks where the user model's _id is equal to
  foreignField: 'owner' //the task model's owner-id
})


//Override the toJSON method and remove the tokens and avatar
//The JSON.stringify() method uses this toJSON() method to 
//convert the JS object to a JSON string before sending it
userSchema.methods.toJSON = function () {
  const user = this;

  //Get raw object without extra mongoose properties
  const userObject = user.toObject(); //provided by mongoose

  //Delete avatar binary, password and tokens from raw object
  //delete userObject.password;
  delete userObject.tokens;

  //We have a separate route to get the avatar
  delete userObject.avatar; //would create large request

  return userObject;
}

//Static method to find a user by uid credential from Firebase
//Returns the user with the matching uid
userSchema.statics.findByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(`Unable to login. Email ${email} not found`);
  }
  return user;

}

//Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
  const user = this; // the user document

  await Task.deleteMany({ owner: user._id });
  next();

});

//Mongoose will create a 'users' collection in 
//the database for the User model
const User = mongoose.model('User', userSchema);

module.exports = User;