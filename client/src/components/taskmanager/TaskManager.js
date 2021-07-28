import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'semantic-ui-react';
import Task from './Task';
import { loadUser, fetchTasks } from '../../actions/index';
import TaskCreateForm from './TaskCreateForm';
import '../../styles/TaskManager.css';

const TaskManager = () => {
  const dispatch = useDispatch();
  //Data from redux store
  const isSignedIn = useSelector( state => state.auth.isSignedIn);
  const retrievedTasks = useSelector( state => state.tasks.tasks );
  console.log("Retrieved tasks", retrievedTasks);
  
  //Local copy of user modified tasks
  const [tasks, setTasks] =  useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const prevSignedInStatus = useRef(false);
       
  //Get tasks if user just signed in
  useEffect ( () => {
    console.log("Task Manager useEffect prevSignedInStatus", prevSignedInStatus);
    
    //Sign in status changed from false to true so get this
    //user's tasks
    if (!prevSignedInStatus.current && isSignedIn){
      console.log("TaskManager useEffect: user is NOW signed in! Fetching tasks");

      //Get the user's tasks from the database
      dispatch(fetchTasks());
     
    }

    //Save the current sign in status
    prevSignedInStatus.current = isSignedIn;
    console.log("Task Manager useEffect UPDATING prevSignedInStatus", prevSignedInStatus);
  },[isSignedIn]);

  //Update rendered tasks when the state store changes
  useEffect (() => {
    //Update our local copy of the tasks
    setTasks(retrievedTasks);

    //Update the list of tasks rendered based on the new list
    
    let tasksToDisplay = getTasksToRender (retrievedTasks)
    console.log("TaskManager useEffect tasksToDisplay:", tasksToDisplay);
    setDisplayedTasks(tasksToDisplay);
    
  }, [retrievedTasks]);

  //Returns the tasks to render
  const getTasksToRender = (tasks) => {
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
  }  

  //Toggle the task with the id specified   
  const toggleCompleted = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task.id ===id){
        return { ...task, completed: !task.completed};
      } else {
        return task;
      }
    });
    setTasks(updatedTasks);
  }

  return (
    <div className="TaskManager">
      <div>
        <h1>My Tasks</h1>
      </div>
      <List>          
        {displayedTasks}
      </List>
      <TaskCreateForm />      
    </div>
  );
}


export default TaskManager;