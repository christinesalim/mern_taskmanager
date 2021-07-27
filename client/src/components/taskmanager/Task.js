import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Checkbox, List, Icon } from 'semantic-ui-react';
import { editTask, deleteTask } from '../../actions/index';
import '../../styles/Task.css';

class Task extends Component {
  constructor(props){
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleTaskUpdate = this.handleTaskUpdate.bind(this);
    this.handleCompleted = this.handleCompleted.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.state = { description: this.props.description, isEditing: false};
  }

  handleDelete(){
    //Dispatch action to delete the task
    this.props.deleteTask(this.props.id);
    
  }

  handleEdit(){      
    this.toggleForm();
  }

  toggleForm(){
    this.setState({isEditing : !this.state.isEditing});
  }

  handleChange(e){
    this.setState({
      [e.target.name] : e.target.value 
    });    
  }

  handleTaskUpdate(){
    
    //Dispatch action creator to edit the task 
    const task = {      
      description: this.state.description, 
      completed: this.props.completed
    };
    console.log("Task component handleTaskUpdate: ", task);
    this.props.editTask(this.props.id, task);

    this.toggleForm();
  }

  handleCompleted(){
    console.log("Completed clicked");
    const task = {
      description: this.state.description,
      completed: !this.props.completed //toggle the completed status
    }
    this.props.editTask(this.props.id, task);
  }

  render(){
    let result;
  
    if (this.state.isEditing){
      result = <div>
        <Form onSubmit={this.handleTaskUpdate} className="Task-edit-form">
          <Form.Input
            className="Task-edit-input"
            value={this.state.description}  
            onChange={this.handleChange}
            name="description"
          ></Form.Input>
          <div className="Task-save-button">
            <Button  size="mini" icon type="submit">
              <Icon name="save" />
            </Button>
          </div>
        </Form>
      </div>;      
    }else {
      result = <div className="Task">
      <List.Item className={`Task-li ${this.props.completed? 'Task-completed':''} `} >
        <Checkbox 
          className="Task-checkbox" 
          checked={this.props.completed}
          onClick={this.handleCompleted}            
        />
        {this.state.description}
        <div className="Task-buttons">          
          <Button size="mini" icon onClick={this.handleEdit}>
            <Icon name="edit" />
          </Button>
          <Button size="mini" icon onClick={this.handleDelete}>
            <Icon name="trash" />
          </Button>
        </div>
      </List.Item>
      </div>
    }

    return result;         
  }

};

export default connect (null, {editTask, deleteTask})(Task);