import {
  FIREBASE_SIGNED_IN,
  FIREBASE_SIGNED_UP,
  SIGN_OUT,
  LOADED_USER,
  AUTH_ERROR,
  AUTH_ERROR_DISPLAYED
} from '../actions/types';

const INITIAL_STATE = {
  isSignedIn: null,
  userData: null,
  error: null
};

const authReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {
    case FIREBASE_SIGNED_IN:
      //create new state object, with existing values copied
      // and add the isSignedIn state
      console.log("authReducer: user signed IN successfully on backend");

      console.log("Retrieved user data: ", action.payload);

      return { ...state, isSignedIn: true, userData: action.payload, error: null };

    case FIREBASE_SIGNED_UP:
      //Update user values and add the isSignedIn state
      console.log("authReducer: user signed UP successfully on backend");
      console.log("Created user data: ", action.payload);

      return { ...state, isSignedIn: true, userData: action.payload, error: null };

    case LOADED_USER:
      //Update user values and add the isSignedIn state
      console.log("authReducer: user loaded successfully on backend");
      console.log("Retrieved user data: ", action.payload);

      return { ...state, isSignedIn: true, userData: action.payload, error: null };


    case SIGN_OUT:
      console.log("Signed out user in authReducer");
      localStorage.clear();
      return { ...state, isSignedIn: false, userData: null, error: null };


    case AUTH_ERROR:
      console.log("Received authentication error");
      return {
        ...state, isSignedIn: false, userData: null,
        error: action.payload
      };


    case AUTH_ERROR_DISPLAYED:
      console.log("Auth error displayed ");
      return { ...state, error: null };

    default:
      return state;
  }
};

export default authReducer;