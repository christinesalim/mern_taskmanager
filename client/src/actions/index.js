import history from '../history';

import { 
  FETCH_TASKS, 
  CREATE_TASK, 
  SIGN_IN, 
  SIGN_OUT, 
  LOAD_USER, 
  EDIT_TASK, 
  DELETE_TASK, 
  UPLOAD_AVATAR_COMPLETED, 
  GET_AVATAR_RESPONSE_RECEIVED, 
  UPLOAD_AVATAR_REQ_RECEIVED,
  DELETED_AVATAR_FILE,
  UPLOAD_AVATAR_ERROR,
  GET_AVATAR_ERROR,
  AUTH_ERROR,
  AUTH_ERROR_DISPLAYED
} from './types';
import * as api from '../api/index.js';

//Handle loading an existing user: we already have user's data
//and token saved
export const loadUser = () => {
  return { 
    type: LOAD_USER 
  };
};


//Action to handle user signing in
export const signIn = (formData) => async dispatch => {
  try {
    const { data } = await api.signIn(formData);

    console.log("Sign in ", data);

    dispatch({ type: SIGN_IN, payload: data });

    history.push('/taskmanager');
  }catch (error){
    console.log("Error", error.message);
    dispatch({ type: AUTH_ERROR, payload: error });
  }
  
};

//Action to handle user signing in through google auth2
export const googleSignIn = (token) => async dispatch => {

  try{
    const { data } = await api.googleSignIn(token);
    console.log("Google login data", data);
    dispatch({ type: SIGN_IN, payload: data });
    history.push('/taskmanager');
  } catch(error){
    console.log("Error", error.message);
    dispatch({ type: AUTH_ERROR, payload: error });
  }
};

//Action to handle user signing up
export const signUp = (formData) => async dispatch => {
  try {
    console.log("In signUp action creator", formData);
    const { data } = await api.signUp(formData);

    dispatch({ type: SIGN_IN, payload: data });

    history.push('/taskmanager');
  }catch (error){    
      console.log("Error", error.message);
      dispatch({ type: AUTH_ERROR, payload: error });    
  }
  
};

//Action to sign out the user
export const signOut = () => async dispatch => {

  console.log("Action creator: Signing out user");
  await api.signOut();
  dispatch ({ type: SIGN_OUT });
  history.push('/');
};


//Get tasks from the backend database
export const fetchTasks = () => async dispatch =>  {
  try {
    console.log("About to fetch tasks");
    const response = await api.fetchTasks();
    console.log("Fetched tasks", response);

    dispatch({ type: FETCH_TASKS, payload: response.data });
  }catch (error){
    console.log(error);
  }
}

//Send a new task to the backend database
export const createTask = (task) => async dispatch => {
  try{
    console.log("Adding task to database");
    const response = await api.createTask(task);
    console.log("Create task response", response);
    dispatch({ type: CREATE_TASK, payload: response.data });
  }catch(error){
    console.log(error);
  }
}

//Edit an existing task in the backend database
export const editTask = (id, task) => async dispatch => {
  try {
    console.log("Editing task in database", task);
    const response = await api.editTask(id, task);
    console.log("In editTask action response received:", response);
    dispatch({ type: EDIT_TASK, payload: response.data });
  }catch(error){
    console.log(error);
  }
}

//Delete a task
export const deleteTask = (id) => async dispatch => {
  try {
    const response = await api.deleteTask(id);
    dispatch({ type: DELETE_TASK, payload: response.data });

  }catch (error){
    console.log(error);
  }
}

//Upload avatar file
export const uploadAvatarFile = (fileName, formData) => async dispatch => {
  try {
    dispatch({ type: UPLOAD_AVATAR_REQ_RECEIVED, payload: fileName });

    const response = await api.sendAvatarFile(formData);
    console.log("Response to avatar upload: ", response);
    
    dispatch({ type: UPLOAD_AVATAR_COMPLETED, payload: response.status });
  }catch(error){
    console.log("Error", error.message);
    dispatch({ type: UPLOAD_AVATAR_ERROR, payload: error });
  }
}

//Get avatar file from backend
export const getAvatarFile = (id) => async dispatch => {
  try {
    const response = await api.getAvatarFile(id);
    const imageURL = URL.createObjectURL(response.data);
    
    dispatch({ type: GET_AVATAR_RESPONSE_RECEIVED, payload: imageURL });
  } catch(error){
    console.log(error);
    dispatch({ type: GET_AVATAR_ERROR, 
      payload: { 
        data: error?.response.data, 
        status: error?.response.status,
      }});
  }
}

//Delete avatar from backend
export const deleteAvatarFile = () => async dispatch => {
  try {
    const response = await api.deleteAvatarFile();
    dispatch ({  type: DELETED_AVATAR_FILE, payload: response.status });

  } catch (error){
    console.log(error);
  }
}

export const displayedAuthError = () => {
  return { 
    type: AUTH_ERROR_DISPLAYED 
  };
}