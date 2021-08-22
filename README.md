# mern_taskmanager
MERN application to manage tasks

This project uses a React front end and a Mongo DB and Express backend.
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
