import { 
  UPLOAD_AVATAR_COMPLETED, 
  GET_AVATAR_RESPONSE_RECEIVED, 
  DELETED_AVATAR_FILE,
  UPLOAD_AVATAR_REQ_RECEIVED,
  UPLOAD_AVATAR_ERROR,
  GET_AVATAR_ERROR, 
  SIGN_OUT
} from '../actions/types';

const INITIAL_STATE = {
  fileName: null,
  file: null,
  fileUploaded: false,
  uploadStatus: null,
  deleteStatus: null,
  error: null
};

const AvatarReducer = ( state = INITIAL_STATE, action) => {
  
    switch(action.type) {
      case UPLOAD_AVATAR_REQ_RECEIVED:
        console.log("UPLOAD_AVATAR_REQ_RECEIVED for file", action.payload);
        return{ 
          ...state, 
          fileName: action.payload, 
          fileUploaded: false, 
          error: null 
        };
      case UPLOAD_AVATAR_COMPLETED:
        console.log("UPLOAD_AVATAR_COMPLETED reducer ");
        return { 
          ...state, 
          fileUploaded: true, 
          uploadStatus: action.payload, 
          error: null 
        };
      case UPLOAD_AVATAR_ERROR:
        console.log("UPLOAD_AVATAR_ERROR", action.payload);
        return { 
          ...state, 
          error: action.payload 
        };
      case GET_AVATAR_RESPONSE_RECEIVED:
        console.log("GET_AVATAR_RESPONSE_RECEIVED reducer ", action.payload);
        return {
          ...state, 
          file: action.payload, 
          error: null, 
          fileUploaded: false  //Indicate we are displaying the latest file
                               //and reset the uploaded flag
        };
      case GET_AVATAR_ERROR:
        console.log("GET_AVATAR_ERROR", action.payload);
        return { 
          ...state, 
          error: action.payload 
        };
      case DELETED_AVATAR_FILE:
        return { 
          ...state, 
          fileName: null, 
          file: null, 
          fileUploaded: false, 
          deleteStatus: action.playload, 
          error: null  
        };
      case SIGN_OUT:
        console.log("Signed out user in avatarReducer");
      
        return { 
          ...state, 
          fileName: null,
          file: null,
          fileUploaded: false,
          uploadStatus: null,
          deleteStatus: null,
          error: null 
        };
      default:
        return state;
    }
};

export default AvatarReducer;