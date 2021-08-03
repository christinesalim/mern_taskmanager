//Commands to run this project in two separate terminals run:
///Users/Christine/mongodb/bin/mongod --dbpath=/Users/Christine/mongodb-data
//npm run dev


const express = require('express');
const cors = require ('cors');

require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

//Automaticaly parse incoming data as json object
app.use(express.json());

app.use(cors());


//Recogize incoming objects as strings and arrays
app.use(express.urlencoded({extended:false}));

//Use User Router and Task Router
app.use(userRouter);
app.use(taskRouter);

//For heroku deployment
app.get('/', (req, res) => {
  res.send('Hello to Task Manager API');
});

module.exports = app;