import {
  FIREBASE_SIGNED_IN,
  FIREBASE_SIGNED_UP,
  SIGN_OUT,
  AUTH_ERROR,
  AUTH_ERROR_DISPLAYED,
  UPDATE_PROFILE,
  UPDATE_PROFILE_RESPONSE_RECEIVED,
  UPDATE_PROFILE_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  isSignedIn: null,
  userData: null,
  error: null,
  loading: false
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


    case SIGN_OUT:
      console.log("Signed out user in authReducer");
      localStorage.clear();
      return { ...state, isSignedIn: false, userData: null, error: null };


    case AUTH_ERROR:
      console.log("Received authentication error", action.payload);
      return {
        ...state, isSignedIn: false, userData: null,
        error: action.payload
      };


    case AUTH_ERROR_DISPLAYED:
      console.log("Auth error displayed ");
      return { ...state, error: null };

    case UPDATE_PROFILE:
      console.log('UPDATE_PROFILE reducer');
      return { ...state, loading: true, error: null };

    case UPDATE_PROFILE_RESPONSE_RECEIVED:
      console.log('UPDATE_PROFILE_RESPONSE reducer');
      return { ...state, loading: false, userData: action.payload, error: null };

    case UPDATE_PROFILE_ERROR:
      console.log('UPDATE_PROFILE_ERROR reducer');
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default authReducer;