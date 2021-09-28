import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Form, Message } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../firebase/firebaseContext';
import history from '../../history';
import { signedIn } from '../../actions';


//Create a schema for validating the form
const schema = yup.object().shape({
  email: yup.string().email().required('Please enter an email address'),
  password: yup.string().min(7).max(15).required('Please enter a password'),
});

//Function to sign in existing user
const SignIn = () => {
  const dispatch = useDispatch();
  const showPassword = false;
  const passwordFieldType = `${showPassword ? 'input' : 'password'}`;
  const { signInFirebase } = useAuth();
  //Loading state to disable Sign In button once it's clicked
  const [loading, setLoading] = useState(false);
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const authError = useSelector((state) => state.auth.error);
  const signInButtonClassName = 'ui basic button' + (loading ? 'disabled' : '');
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrorClassName, setFormErrorClassName] = useState('');

  //useForm hook to setup the form with yup validation
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  //For testing only
  useEffect(() => {
    reset({
      email: 'johndoe@gmail.com',
      password: '11111111'
    });
  }, [])

  useEffect(() => {
    console.log('SignIn received auth error');
    if (loading && authError) {
      setFormErrorClassName('error');

      //Provided very technical not user friendly message
      //setErrorMessage(authError.message);
      setErrorMessage('There was a problem connecting to the service')

    }
    //eslint-disable-next-line
  }, [authError]);


  const submitForm = async (data) => {
    console.log('SignIn form submit:', data);
    setFormErrorClassName('');
    setErrorMessage('');
    setLoading(true);
    try {
      //Sign into firebase
      await signInFirebase(data.email, data.password);
      console.log('Sending dispatch. Did we log into firebase? email/password', data.email, data.password);

      //Inform backend server a user signed in
      // dispatch(signedIn({
      //   email: data.email
      // }));
    } catch (error) {
      console.log('SignIn error in submitForm for user', error);
      setFormErrorClassName('error');
      setErrorMessage('Please check the email and password');

    }

  }

  useEffect(() => {
    console.log('signIn useEffect isSignedIn', isSignedIn);
    setLoading(false);
    setFormErrorClassName('');
    setErrorMessage('');
  }, [isSignedIn])



  return (
    <div className='ui container SignIn'>
      <Card className='centered'>
        <Card.Content>
          <Card.Header className='centered'>Already have an account? Just sign in</Card.Header>
        </Card.Content>
        <Card.Content>
          <Form
            autoComplete='off'
            onSubmit={handleSubmit(submitForm)}
            className={formErrorClassName}
          >

            <Form.Field>
              <label>Email</label>
              <input
                className='ui input email'
                id='signin_email'
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
                id='signin_password'
                name='password'
                type={passwordFieldType}
                placeholder='Password'
                {...register('password', {
                  required: 'Required'
                })}
              />
              <p>{errors.password?.message}</p>
            </Form.Field>
            <Message
              error
              header='Unable to sign in'
              content={errorMessage}
            />
            <Button className={signInButtonClassName}>Sign In</Button>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );


}
export default SignIn;


