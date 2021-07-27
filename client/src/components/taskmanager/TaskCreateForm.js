import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createTask } from '../../actions/index';
import { Form, Button } from 'semantic-ui-react';
import '../../styles/TaskCreateForm.css';

class TaskCreateForm extends Component {
  constructor(props){
    super(props);
    //Properties of a task
    this.state = {
      description: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
 

  handleSubmit = async(e) => {
    e.preventDefault();
    //Add a uuid to existing task object and give it to TaskManager
    //this.props.createTask({ ...this.state, id: uuid(), completed: false });
    
    //Generate action creator to create this new task
    this.props.createTask({ ...this.state, completed: false });

    this.setState({description: ""});
   
  }

  handleChange(e){
    this.setState({[e.target.name] : e.target.value});
    
  } 
    
  render(){
    return (      
      <Form onSubmit={this.handleSubmit}>
        <div className="TaskCreateForm" >
          <Form.Input
            className="TaskCreateForm-input"
            label="New Task"
            id="description"
            name="description" 
            type="text" 
            value={this.state.description}
            onChange={this.handleChange}            
            />
          <Button className="TaskCreateForm-submit" type="submit" value="Submit">
          Add
          </Button>
        </div>
      </Form>
  
      
    );
  }
}



export default connect(null, {createTask})(TaskCreateForm);