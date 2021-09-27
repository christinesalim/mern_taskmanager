import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Message } from 'semantic-ui-react';
import Task from './Task';
import Avatar from '../avatar/avatar';

import { fetchTasks } from '../../actions/index';
import TaskCreateForm from './TaskCreateForm';
import '../../styles/TaskManager.css';
import { useAuth } from '../firebase/firebaseContext';


const TaskManager = () => {
  const dispatch = useDispatch();
  //Data from redux store
  const user = useSelector((state) => state.auth.userData);
  const isSignedIn = useSelector(state => state.auth.isSignedIn);
  const retrievedTasks = useSelector(state => state.tasks.tasks);

  //Local copy of user modified tasks
  const [tasks, setTasks] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const prevSignedInStatus = useRef(false);

  const { currentUser, idToken } = useAuth();

  //Update the tasks displayed for the user
  useEffect(() => {
    if (currentUser && idToken) {
      //Get the user's tasks from the database
      dispatch(fetchTasks());
    }
  }, [currentUser, idToken]);

  //Returns the tasks to render
  const getTasksToRender = useCallback(() => {
    //Toggle the task with the id specified   
    const toggleCompleted = (id) => {
      const updatedTasks = tasks.map(task => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        } else {
          return task;
        }
      });
      setTasks(updatedTasks);
    }

    if (tasks) {
      return tasks.map(task => {
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
  }, [tasks]);


  //Update rendered tasks when the state store changes
  useEffect(() => {
    //Update our local copy of the tasks
    setTasks(retrievedTasks);

    //Update the list of tasks rendered based on the new list    
    let tasksToDisplay = getTasksToRender(retrievedTasks)

    setDisplayedTasks(tasksToDisplay);

  }, [retrievedTasks, getTasksToRender]);

  console.log('Task Manager user', user);
  return (
    <div>
      {user ? (
        <>
          <div className="TaskManager">
            <div className="TaskManager-Heading">
              <Avatar type={"avatar"} id={user._id} />
              <span className="TaskManager-Title">My Tasks</span>
            </div>
            <List>
              {displayedTasks}
            </List>
            <TaskCreateForm />
          </div>
        </>) :
        (
          <Message>Please log in or sign up to view and manage your tasks.</Message>
        )
      }
    </div>
  );
}


export default TaskManager;