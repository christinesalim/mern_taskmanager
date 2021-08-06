import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Message } from 'semantic-ui-react';
import Task from './Task';
import Avatar from '../avatar/Avatar';

import { fetchTasks } from '../../actions/index';
import TaskCreateForm from './TaskCreateForm';
import '../../styles/TaskManager.css';

const TaskManager = () => {
  const dispatch = useDispatch();
  //Data from redux store
  const user = useSelector( (state) => state.auth.userData);
  const isSignedIn = useSelector( state => state.auth.isSignedIn);
  const retrievedTasks = useSelector( state => state.tasks.tasks );
   
  //Local copy of user modified tasks
  const [tasks, setTasks] =  useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const prevSignedInStatus = useRef(false);
 
  const fetchDatabaseTasks = useCallback( () => {
    //Get the user's tasks from the database
    dispatch(fetchTasks());
  },[dispatch]);  

  //Returns the tasks to render
  const getTasksToRender = useCallback( () => {
    //Toggle the task with the id specified   
    const toggleCompleted =  (id) => {
      const updatedTasks = tasks.map(task => {
        if (task.id ===id){
          return { ...task, completed: !task.completed};
        } else {
          return task;
        }
      });
      setTasks(updatedTasks);
    }

    if(tasks){
      return tasks.map( task => {
        return (
          <Task className='TaskManager-Task'
            key={task._id} 
            id={task._id} 
            description={task.description}
            completed={task.completed}             
            toggleCompleted={toggleCompleted}
          />
        );
      });
    }
  },[tasks] );
       
  //Get tasks if user just signed in
  useEffect ( () => {
    //console.log("Task Manager useEffect prevSignedInStatus", prevSignedInStatus);
    
    //Sign in status changed from false to true so get this
    //user's tasks
    if (!prevSignedInStatus.current && isSignedIn){
      //console.log("TaskManager useEffect: user is NOW signed in! Fetching tasks");
      fetchDatabaseTasks();    
     
    }

    //Save the current sign in status
    prevSignedInStatus.current = isSignedIn;
    
  },[isSignedIn, fetchDatabaseTasks]);

  //Update rendered tasks when the state store changes
  useEffect (() => {
    //Update our local copy of the tasks
    setTasks(retrievedTasks);

    //Update the list of tasks rendered based on the new list    
    let tasksToDisplay = getTasksToRender (retrievedTasks)
    
    setDisplayedTasks(tasksToDisplay);
    
  }, [retrievedTasks, getTasksToRender]); 
  
  return (
    <div>
      { user ? (
        <>
          <div className="TaskManager">
            <div className="TaskManager-Heading">
              <Avatar type={"avatar"} id={user.user._id}/>
              <span className="TaskManager-Title">My Tasks</span>
            </div>
            <List>          
              {displayedTasks}
            </List>
            <TaskCreateForm />   
          </div>
        </> )  :
        (
          <Message>Please log in or sign up to view and manage your tasks.</Message>
        )
      }
    </div>
  );
}


export default TaskManager;