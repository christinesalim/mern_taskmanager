import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Icon} from 'semantic-ui-react';
import { signUp, signIn, googleSignIn } from '../actions';

import { GoogleLogin } from 'react-google-login';
import '../styles/Auth.css';


const initialState = { 
  firstName: '', 
  lastName: '', 
  email:'',
  password:'',
  confirmPassword: ''
};

const Auth = () => {  
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [isSignUp, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleShowPassword = () => {    
    setShowPassword(!showPassword);    
  }

  const switchMode = () => {
    //Toggle between sign in and sign up
    console.log("switchmode");
    setForm({ 
      firstName: '', 
      lastName: '', 
      email:'',
      password:'',
      confirmPassword: ''
    });    
   
    setIsSignup( (prevIsSignUp) => !prevIsSignUp);
    setShowPassword(false);
    setIsSubmitting(false);
    setFormErrors({});    
    
  }

  const handleChange = (e) => {        
    setForm({...form, 
    [e.target.name] : e.target.value});    
  }

  const validateForm = () => {
    console.log("validateForm: isSubmitting", isSubmitting)
    const errors = {};
  
    //Signup form has additional fields to validate
    if (isSignUp){

      if (!form.firstName){
        errors.firstName = "Please enter a first name";      
      }
      if (!form.lastName){
        errors.lastName = "Please enter a last name";
      }  

      if (!form.confirmPassword || form.confirmPassword.length < 8){
        errors.confirmPassword = "Password must be at least 8 characters";
      }  
  
      if (form.password !== form.confirmPassword){
        errors.confirmPassword = "Passwords must match"
      }
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!form.email){
      errors.email = "Please enter an email";
    }else if (!regex.test(form.email)){
      errors.email = "Please enter a valid email";      
    }

    if (!form.password || form.password.length < 8){
      errors.password = "Password must be at least 8 characters";
    }     
    return errors;
  } 

  const handleSubmit = (e) => {
    e.preventDefault();
    
    //Validate the form and indicate user clicked submit
    setFormErrors(validateForm());
    setIsSubmitting(true);   
  }

  //If no errors, we dispatch the form
  //useCallback is used to avoid re-creating this function on every render
  const submitForm = useCallback(() => {
    if (isSignUp){
      dispatch(signUp(form));
    }else{
      dispatch(signIn(form));
    }
  },[form, isSignUp, dispatch]);
  

  useEffect(()=> {    
    
    if ( isSubmitting && Object.keys(formErrors).length === 0){
      console.log("isSubmitting", isSubmitting);
      submitForm();
    }
  },[formErrors, isSubmitting, submitForm]);
  
  const googleSuccess = async (res) => {    
    const token = res?.tokenId;    
    try {
      //Send token object from google oauth2 to our backend
      dispatch(googleSignIn({token}));      
    } catch(e){
      console.log(e);
    }
  }

  const googleError = () => alert('Google Sign In was unsuccessful. Try again later');

  const passwordFieldType = `${showPassword? "input" : "password"}`;
  
  console.log("Before return formdata", form);

  return(
    
    <div className="SignUp ">      
      <Form >       
        { isSignUp && (
          <>
            <Form.Field>     
              < Form.Input       
                id="firstName"
                name="firstName" 
                type="text" 
                placeholder="First Name"
                error={formErrors.firstName ? {
                  content: formErrors.firstName,
                  pointing: 'below'
                }: null}
                value={form.firstName}
                onChange={handleChange}              
              />
            </Form.Field> 
              <Form.Input 
                id="lastName"
                name="lastName" 
                type="text" 
                placeholder="Last Name"
                error={formErrors.lastName ? 
                  {
                    content: formErrors.lastName,
                    pointing: 'below'
                  }: null 
                }
                value={form.lastName}
                onChange={handleChange}
              />
            <Form.Field/>
         </>
        )}
       <Form.Field>            
        <Form.Input           
          className="ui input email"
          id="email"
          name="email" 
          type="text" 
          placeholder="Email"
          error={formErrors.email ? 
            {
              content: formErrors.email,
              pointing: 'right'
            }: null 
          }
          value={form.email}
          onChange={handleChange}
          
        />                
        </Form.Field>

        <Form.Field>  
          <Form.Input 
            icon={
              <Icon 
                name={showPassword? 'eye slash' : 'eye'}
                link
                onClick={handleShowPassword}
              />
            }
            id="password"
            name="password" 
            type={passwordFieldType}
            onChange={handleChange}
            error={formErrors.password ? 
              {
                content: formErrors.password,
                pointing: 'below'
              }: null 
            }
            placeholder="Password"              
            value={form.password}
          />                  
        </Form.Field>
        { isSignUp && (
          <>        
            <Form.Field>  
              <Form.Input 
                id="confirmPassword"
                name="confirmPassword" 
                type={passwordFieldType}
                onChange={handleChange}
                error={formErrors.confirmPassword ? 
                  {
                    content: formErrors.confirmPassword,
                    pointing: 'below'
                  }: null 
                }
                placeholder="Confirm Password"
                value={form.confirmPassword}
              />        
            </Form.Field>
          </>
        )}
        <div className="SignUp-SignUpButton">          
        <Button className='fluid ui button' type="submit" onClick={handleSubmit}>{isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
        </div>
        <div className="ui horizontal divider">
        Or
        </div>
        <div className="SignUp-SignInButton">
        <GoogleLogin
          clientId = '202556023160-uglkeodct8n1ctvrotf5pn4v2nomshdl.apps.googleusercontent.com'
          render={ (renderProps) => (
            <Button className="ui google button primary"
              onClick={renderProps.onClick}>
              <i className="google icon"/>
              Google Sign In
            </Button>          
          )}
          onSuccess = {googleSuccess}
          onFailure = {googleError}
          cookiePolicy="single_host_origin"
        />

          
        <Button onClick={switchMode} className="ui basic button">
          { isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
        </Button>
        </div>


      </Form>
    </div>
  );
}

export default Auth;
  