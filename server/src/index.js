//Commands to run this project in two separate terminals run:
///Users/Christine/mongodb/bin/mongod --dbpath=/Users/Christine/mongodb-data
//npm run dev
const app = require('./app');

//Heroku uses env variable PORT; config file sets port env 3000
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

