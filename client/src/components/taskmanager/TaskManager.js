import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'semantic-ui-react';
import Task from './Task';
import { loadUser, fetchTasks } from '../../actions/index';
import TaskCreateForm from './TaskCreateForm';
import '../../styles/TaskManager.css';

class TaskManager extends Component {
  constructor(props){
    super(props);
    this.state = {tasks: []};
       
    this.toggleCompleted = this.toggleCompleted.bind(this);
   
  }

  componentDidMount(){
    if(!this.props.authData.isSignedIn){
      console.log("TaskManager componentDidMount: loading user");
      //Action to get user data previously saved if available
      this.props.loadUser();
    }

    //Is user signed in
    if (this.props.authData.isSignedIn){
      console.log("TaskManager componentDidMount: user is signed in! Fetching tasks");

      //Get the user's tasks from the database
      this.props.fetchTasks();
    }  
   
  }

  componentDidUpdate(prevProps){
    console.log("componentDidUpdate prevProps", prevProps);
    
    if (!prevProps.authData.isSignedIn && this.props.authData.isSignedIn){
      console.log("TaskManager componentDidUpdate: user is signed in! Fetching tasks");

      //Get the user's tasks from the database
      this.props.fetchTasks();
      
    }

    //When redux tasks array changes, update the tasks displayed
    if (prevProps.tasks !== this.props.tasks){
      this.setState({
        tasks: this.props.tasks
      })
    }
  }
    

  toggleCompleted(id){
    const updatedTasks = this.state.tasks.map(task => {
      if (task.id ===id){
        return { ...task, completed: !task.completed};
      } else {
        return task;
      }
    });
    this.setState({tasks: updatedTasks});
  }

  render (){
    let tasks = null;
    if (this.state.tasks){
      tasks = this.state.tasks.map( task => {
        return (
          <Task className='TaskManager-Task'
            key={task._id} 
            id={task._id} 
            description={task.description}
            completed={task.completed}
           
            toggleCompleted={this.toggleCompleted}
          />
        );
      });
      console.log("TaskManager render tasks:", this.state.tasks);
    }
    return (
      <div className="TaskManager">
        <h1>My Tasks</h1>
        <List>          
          {tasks}
        </List>
        <TaskCreateForm />      
      </div>
    );
  }
  
};

const mapStateToProps = (state) => {
  return { 
    authData: state.auth,
    tasks: state.tasks.tasks
  };
}

export default connect(mapStateToProps, { loadUser, fetchTasks })(TaskManager);