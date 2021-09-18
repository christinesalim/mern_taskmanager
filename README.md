# mern_taskmanager
The Task Manager is a MERN stack application to manage a user's tasks. 
The user can log in by creating a new account or using their Google credentials.
JWT tokens are used to securely transmit user data between the user and the Node 
Express backend once the user is authenticated.
The user's account and task data is stored in a MongoDB database on the cloud. 
Mongoose is used to create a schema for the user and task data.
Additionally, when the user first signs up a welcome email is sent to them via
SendGrid.

The Front End for this application is deployed on Netlify and the backend is
deployed on Heroku

Client: Needs .env file with 
REACT_APP_BASE_URL=<url to heroku server or localhost server>
REACT_APP_GOOGLE_CLIENT_ID=< your client id>

Server: Needs config/dev.env setup with
SENDGRID_API_KEY=<your api key>
MONGODB_URL=<your cluster url>
JWT_SECRET=<your JWT secret>
CLIENT_ID=<your google client id>

Netlify deploy notes:
**Need to add a _redirects file to the build directory with contents:
/* /index.html 200
The build directory is not in github since npm run build generates it.
