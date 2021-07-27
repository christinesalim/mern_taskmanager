import { SIGN_IN, SIGN_OUT, LOAD_USER } from '../actions/types';

const  INITIAL_STATE = {
  isSignedIn: null,
  userData: null
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
      
      return { ...state, isSignedIn: true, userData: action.payload};

    case LOAD_USER:
      console.log("Load user in authReducer");
      //Get a user's token in local storage
      const user = JSON.parse(localStorage.getItem('taskmanager'));
      console.log("loaded user", user);
      state.isSignedIn = user ? true : false;
      
      return { ...state, userData: user};
    
   
    case SIGN_OUT:
      console.log("Signed out user in authReducer");
      localStorage.clear();
      return { ...state, isSignedIn: false, userData: null };

    default:
      return state;
  }
};

export default authReducer;