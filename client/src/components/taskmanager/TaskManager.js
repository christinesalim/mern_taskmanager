import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Image, Message } from 'semantic-ui-react';
import Task from './Task';
import emptyProfile from '../../images/blank-profile-picture.png';
import { fetchTasks, getAvatarFile } from '../../actions/index';
import TaskCreateForm from './TaskCreateForm';
import '../../styles/TaskManager.css';

const TaskManager = () => {
  const dispatch = useDispatch();
  //Data from redux store
  const user = useSelector( (state) => state.auth.userData);
  const isSignedIn = useSelector( state => state.auth.isSignedIn);
  const retrievedTasks = useSelector( state => state.tasks.tasks );
  const databaseAvatarInfo = useSelector( state => state.avatar );
  
  //Local copy of user modified tasks
  const [tasks, setTasks] =  useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const prevSignedInStatus = useRef(false);

  const getAvatar = useCallback(()=> {
    dispatch(getAvatarFile(user?.user._id));
  },[user?.user._id, dispatch]);

  //If we don't yet have the avatar, get it from the database
  useEffect ( () => {   
    console.log("databaseAvatarInfo", databaseAvatarInfo);
    
    if (user?.user._id && !databaseAvatarInfo?.file){
      console.log("TaskManager Getting avatar for this user");          
      getAvatar();
    }    
  }, [user?.user._id, databaseAvatarInfo, getAvatar]);

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
    console.log("Task Manager useEffect prevSignedInStatus", prevSignedInStatus);
    
    //Sign in status changed from false to true so get this
    //user's tasks
    if (!prevSignedInStatus.current && isSignedIn){
      console.log("TaskManager useEffect: user is NOW signed in! Fetching tasks");
      fetchDatabaseTasks();    
     
    }

    //Save the current sign in status
    prevSignedInStatus.current = isSignedIn;
    console.log("Task Manager useEffect UPDATING prevSignedInStatus", prevSignedInStatus);
  },[isSignedIn, fetchDatabaseTasks]);

  //Update rendered tasks when the state store changes
  useEffect (() => {
    //Update our local copy of the tasks
    setTasks(retrievedTasks);

    //Update the list of tasks rendered based on the new list    
    let tasksToDisplay = getTasksToRender (retrievedTasks)
    console.log("TaskManager useEffect tasksToDisplay:", tasksToDisplay);
    setDisplayedTasks(tasksToDisplay);
    
  }, [retrievedTasks, getTasksToRender]);
  

  return (
    <div>
      { user ? (
        <>
          <div className="TaskManager">
            <div className="TaskManager-Heading">
              {databaseAvatarInfo.file? 
                <Image src={databaseAvatarInfo.file} alt="avatar" avatar/> : 
                <Image src={emptyProfile} alt="no avatar" avatar/> 
              }     
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