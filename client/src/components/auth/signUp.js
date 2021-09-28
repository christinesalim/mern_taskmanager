import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../firebase/firebaseConfig';
import { Card, Button, Form, Message } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../firebase/firebaseContext';
import history from '../../history';

import { signedUp } from '../../actions';

//Create a schema for validating the form
const schema = yup.object().shape({
  firstName: yup.string().required('Please enter a first name'),
  lastName: yup.string().required('Please enter a last name'),
  email: yup.string().email().required('Please enter an email address'),
  password: yup.string().min(7).max(15).required('Please enter a password'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
});

const SignUp = () => {
  const dispatch = useDispatch();
  const showPassword = false;
  const passwordFieldType = `${showPassword ? 'input' : 'password'}`;
  const { signUpFirebase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrorClassName, setFormErrorClassName] = useState('');
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const authError = useSelector((state) => state.auth.error);

  //Should submit button be disabled?
  const submitButtonClassName = 'ui basic button' + (loading ? 'disabled' : '');

  //useForm hook to setup the form with yup validation
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  //Display error message in form for auth error
  useEffect(() => {
    if (loading && authError) {
      setFormErrorClassName('error');
      setErrorMessage(authError);
    }
    //eslint-disable-next-line
  }, [authError]);

  //Submit form callback to sign up a new user with firebase
  const submitForm = async (data) => {
    console.log('SignUp form:', data);
    setLoading(true);
    setFormErrorClassName('');
    setErrorMessage('');

    try {
      //Create a new user
      await signUpFirebase(data.email, data.password);


      //Dispatch event to tell backend server a user signed up
      dispatch(signedUp({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      }));
    } catch (error) {
      console.log('SignUp error in submitForm for user', error);
      setFormErrorClassName('error');
      setErrorMessage(error.message);

    }

  }

  useEffect(() => {
    console.log('signUp useEffect isSignedIn', isSignedIn);
    setLoading(false);
    setFormErrorClassName('');
    setErrorMessage('');
  }, [isSignedIn])

  return (
    <div className='SignUp'>
      <Card className="centered">
        <Card.Content>
          <Card.Header className="centered">Sign up here</Card.Header>
        </Card.Content>
        <Card.Content>
          <Form
            autoComplete='off'
            className={formErrorClassName}
            onSubmit={handleSubmit(submitForm)}
          >
            <Form.Field >
              <label>First Name</label>
              <input
                id='firstName'
                name='firstName'
                type='text'
                placeholder='First Name'
                {...register('firstName', {
                  required: 'Required'
                })}
              />
              <p>{errors.firstName?.message}</p>
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <input
                id='lastName'
                name='lastName'
                type='text'
                placeholder='Last Name'
                {...register('lastName', {
                  required: 'Required'
                })}
              />
              <p>{errors.lastName?.message}</p>
            </Form.Field>

            <Form.Field>
              <label>Email</label>
              <input
                className='ui input email'
                id='email'
                name='email'
                type='text'
                placeholder='Email'
                {...register('email', {
                  required: 'Required'
                })}
              />
              <p>{errors.email?.message}</p>
            </Form.Field>

            <Form.Field>
              <label>Password</label>
              <input
                id='password'
                name='password'
                type={passwordFieldType}
                placeholder='Password'
                {...register('password', {
                  required: 'Required'
                })}
              />
              <p>{errors.password?.message}</p>
            </Form.Field>
            <Form.Field>
              <label>Password confirmation</label>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type={passwordFieldType}
                placeholder='Confirm Password'
                {...register('confirmPassword', {
                  required: 'Required'
                })}
              />
              <p>{errors.confirmPassword?.message}</p>
            </Form.Field>
            <Message
              error
              header='Unable to sign up'
              content={errorMessage}
            />
            <Button className={submitButtonClassName}>Submit</Button>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );


}
export default SignUp;


