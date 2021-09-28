import history from '../history';

import {
  FETCH_TASKS,
  CREATE_TASK,
  FIREBASE_SIGNED_IN,
  FIREBASE_SIGNED_UP,
  SIGN_OUT,
  EDIT_TASK,
  DELETE_TASK,
  UPLOAD_AVATAR_COMPLETED,
  GET_AVATAR_RESPONSE_RECEIVED,
  UPLOAD_AVATAR_REQ_RECEIVED,
  DELETED_AVATAR_FILE,
  UPLOAD_AVATAR_ERROR,
  GET_AVATAR_ERROR,
  AUTH_ERROR,
  AUTH_ERROR_DISPLAYED,
  UPDATE_PROFILE,
  UPDATE_PROFILE_RESPONSE_RECEIVED,
  UPDATE_PROFILE_ERROR
} from './types';
import * as api from '../api/index.js';


//Action to handle user signing in
export const signedIn = (formData) => async dispatch => {
  try {
    console.log('***signedIn action data:', formData);
    const { data } = await api.signedIn(formData);
    console.log('****Sign in response message', data);

    dispatch({ type: FIREBASE_SIGNED_IN, payload: data });
    history.push('/taskmanager');
  } catch (error) {
    console.log('signedIn Actions Error', error.message);
    dispatch({ type: AUTH_ERROR, payload: error });
  }

};

//Action to handle user signing in through google auth2
export const googleSignIn = (token) => async dispatch => {

  try {
    const { data } = await api.googleSignIn(token);
    console.log('Google login data', data);
    dispatch({ type: FIREBASE_SIGNED_IN, payload: data });
    history.push('/taskmanager');
  } catch (error) {
    console.log('googleSignIn Actions Error', error.message);
    dispatch({ type: AUTH_ERROR, payload: error });
  }
};

//Action to handle user signing up via Firebase
export const signedUp = (formData) => async dispatch => {
  try {
    console.log('In signedUp action creator', formData);
    const { data } = await api.signedUp(formData);

    dispatch({ type: FIREBASE_SIGNED_UP, payload: data });

    history.push('/taskmanager');
  } catch (error) {
    console.log('signedUp Actions Error', error.message);
    dispatch({ type: AUTH_ERROR, payload: error });
  }

};

//Action to sign out the user
export const signOut = () => async dispatch => {
  try {
    console.log('Action creator: Signing out user');
    await api.signOut();
    dispatch({ type: SIGN_OUT });
    history.push('/auth');
  } catch (error) {
    console.log('signOut Actions Error', error.message);
    dispatch({ type: AUTH_ERROR, payload: error });
  }
};


//Get tasks from the backend database
export const fetchTasks = () => async dispatch => {
  try {
    console.log('About to fetch tasks');
    const response = await api.fetchTasks();
    console.log('Received tasks from backend', response);

    dispatch({ type: FETCH_TASKS, payload: response.data });
  } catch (error) {
    console.log(error);
  }
}

//Send a new task to the backend database
export const createTask = (task) => async dispatch => {
  try {
    console.log('Adding task to database');
    const response = await api.createTask(task);
    console.log('Create task response', response);
    dispatch({ type: CREATE_TASK, payload: response.data });
  } catch (error) {
    console.log(error);
  }
}

//Edit an existing task in the backend database
export const editTask = (id, task) => async dispatch => {
  try {
    console.log('Editing task in database', task);
    const response = await api.editTask(id, task);
    console.log('In editTask action response received:', response);
    dispatch({ type: EDIT_TASK, payload: response.data });
  } catch (error) {
    console.log(error);
  }
}

//Delete a task
export const deleteTask = (id) => async dispatch => {
  try {
    const response = await api.deleteTask(id);
    dispatch({ type: DELETE_TASK, payload: response.data });

  } catch (error) {
    console.log(error);
  }
}

//Upload avatar file
export const uploadAvatarFile = (fileName, formData) => async dispatch => {
  try {
    dispatch({ type: UPLOAD_AVATAR_REQ_RECEIVED, payload: fileName });

    const response = await api.sendAvatarFile(formData);
    console.log('Response to avatar upload: ', response);

    dispatch({ type: UPLOAD_AVATAR_COMPLETED, payload: response.status });
  } catch (error) {
    console.log('Error', error.message);
    dispatch({ type: UPLOAD_AVATAR_ERROR, payload: error });
  }
}

//Get avatar file from backend
export const getAvatarFile = (id) => async dispatch => {
  try {
    const response = await api.getAvatarFile(id);
    const imageURL = URL.createObjectURL(response.data);

    dispatch({ type: GET_AVATAR_RESPONSE_RECEIVED, payload: imageURL });
  } catch (error) {
    console.log('getAvatarFile error', error);
    dispatch({
      type: GET_AVATAR_ERROR,
      payload: {
        data: error?.response.data,
        status: error?.response.status,
      }
    });
  }
}

//Delete avatar from backend
export const deleteAvatarFile = () => async dispatch => {
  try {
    const response = await api.deleteAvatarFile();
    dispatch({ type: DELETED_AVATAR_FILE, payload: response.status });


  } catch (error) {
    console.log(error);
  }
}

export const displayedAuthError = () => {
  return {
    type: AUTH_ERROR_DISPLAYED
  };
}

export const updateProfile = (formData) => async dispatch => {
  try {
    dispatch({ type: UPDATE_PROFILE });
    const response = await api.updateProfile(formData);

    dispatch({ type: UPDATE_PROFILE_RESPONSE_RECEIVED, payload: response.data });
  } catch (error) {
    console.log('Update Profile error', error);
    dispatch({ type: UPDATE_PROFILE_ERROR, payload: error });
  }
}