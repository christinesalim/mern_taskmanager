import axios from 'axios';


const BASE_URL = process.env.REACT_APP_BASE_URL;


const API = axios.create({ baseURL: BASE_URL });
console.log("BASE_URL", BASE_URL);

//Intercept all requests sent to backend API and add the Bearer token
API.interceptors.request.use((req) => {

  //Do we have JWT token from Firebase?
  if (localStorage.getItem('taskmanager')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('taskmanager'))}`;

  } else {
    console.log('API missing JWT token');
  }
  return req;
})

//Creates a user on the backend server after signing up a user on
//Firebase
export const signedUp = (formData) => {
  return API.post('/users', formData);
}

//Logs in existing user
export const signedIn = (formData) => {
  console.log('API signedIn:', formData);
  return API.put('/users/login', formData);
}

//Log in Google user
export const googleSignIn = (token) => {
  console.log("Sending google token to backend", token);
  return API.get('/users/googlelogin', { token });
}


//Signout the user
export const signOut = () => {
  console.log("Signing out user on backend");
  return API.post('/users/logout');
}

//Get list of tasks
export const fetchTasks = () => {
  console.log("Sending request to fetch tasks");
  return API.get('/tasks');
}

//Create a task in the database
export const createTask = (task) => {
  console.log("Sending request to create task");
  return API.post('/tasks', task);
}

//Update a task in the database
export const editTask = (id, task) => {
  console.log("Sending request to edit the task");
  return API.patch(`/tasks/${id}`, task);
}

//Delete a task in the database
export const deleteTask = (id) => {
  console.log("Sending delete task request");
  return API.delete(`/tasks/${id}`);
}

//Send an avatar file to the backend for this user
export const sendAvatarFile = (formData) => {
  console.log("Sending avatar file request");
  return API.post('/users/me/avatar', formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
}

//Get avatar from backend for this user
export const getAvatarFile = (id) => {
  console.log("Sending avatar get request");
  return API.get(`/users/${id}/avatar`, { responseType: 'blob' });
}

//Delete the avatar file from the backend database
export const deleteAvatarFile = () => {
  return API.delete('/users/me/avatar');
}

//Update the user profile with backend
export const updateProfile = (formData) => {
  console.log("Sending profile update to backend");
  return API.patch('/users/me', formData);
}