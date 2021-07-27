const mongoose = require ('mongoose');
const validator = require ('validator');

//Create a schema to use for the Task Model
const taskSchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: { //tracks who created a task and gives us access to the whole profile with populate()
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' //references User model from models/user.js
  } 
}, {
  timestamps: true //option to get timestamp stored in database
});

//Mongoose will create a tasks collection in the database
//for this model
const Task = mongoose.model('Task', taskSchema );


module.exports = Task;