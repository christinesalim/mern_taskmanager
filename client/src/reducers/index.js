import { combineReducers } from 'redux';
import authReducer from './authReducer';
import taskReducer from './taskReducer';
import avatarReducer from './avatarReducer';

//Store the state under keys named to identify the type of state
export default combineReducers( {
  auth: authReducer, //sign in status
  tasks: taskReducer, //task data
  avatar: avatarReducer //avatar data
});