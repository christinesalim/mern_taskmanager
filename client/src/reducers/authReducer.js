import { SIGN_IN, SIGN_OUT, LOAD_USER, AUTH_ERROR, AUTH_ERROR_DISPLAYED } from '../actions/types';

const  INITIAL_STATE = {
  isSignedIn: null,
  userData: null,
  error: null
};

const authReducer = ( state = INITIAL_STATE, action) => {
  
  switch(action.type) {
    case SIGN_IN: 
      //create new state object, with existing values copied
      // and add the isSignedIn state
      console.log("authReducer: user signed in successfully");

      console.log("Stored user token: ", action.payload.token);

      //Save the user's token in local storage
      localStorage.setItem('taskmanager', JSON.stringify(action.payload));
      
      return { ...state, isSignedIn: true, userData: action.payload, error: null };

    case LOAD_USER:
      console.log("Load user in authReducer");
      //Get a user's token in local storage
      const user = JSON.parse(localStorage.getItem('taskmanager'));
      console.log("loaded user", user);
      state.isSignedIn = user ? true : false;
      
      return { ...state, userData: user, error: null};
    
   
    case SIGN_OUT:
      console.log("Signed out user in authReducer");
      localStorage.clear();
      return { ...state, isSignedIn: false, userData: null, error: null };


    case AUTH_ERROR:
      console.log("Received authentication error");
      return { ...state, isSignedIn: false, userData: null,
        error: action.payload };


    case AUTH_ERROR_DISPLAYED:
      console.log("Auth error displayed ");
      return { ...state, error: null };

    default:
      return state;
  }
};

export default authReducer;