import { FETCH_TASKS, CREATE_TASK, EDIT_TASK, DELETE_TASK, SIGN_OUT} from '../actions/types';

const INITIAL_STATE = {
  tasks: null
};

const taskReducer = ( state = INITIAL_STATE, action) => {
  switch(action.type) {
    case CREATE_TASK: 
      //this new task was just added to the backend database
      console.log("In CREATE_TASK reducer", action.payload);
      //Add the task to the tasks array
      return { ...state, tasks: [...state.tasks, action.payload] }

    case EDIT_TASK:
      //Edit an exisiting task in the database
      console.log("In EDIT_TASK reducer", action.payload);
      return { ...state, 
        tasks: state.tasks.map(
          t => (t._id === action.payload._id ? action.payload : t))};

    case DELETE_TASK:
      //Delete a task from the database
      console.log("In DELETE_TASK reducer", action.payload);
      //Remove the deleted task from the state
      return {...state,
        tasks: state.tasks.filter(t => t._id !== action.payload._id)
      };

    case FETCH_TASKS: 
      //create new state object, with existing values copied
      // and add the isSignedIn state
      console.log('In FETCH_TASKS reducer', action.payload);
      return { ...state, tasks: action.payload}

    case SIGN_OUT: 
      console.log("Deleting tasks from signing out");
      return { ...state, tasks: null };
    default:
      return state;
  }
};

export default taskReducer;
    