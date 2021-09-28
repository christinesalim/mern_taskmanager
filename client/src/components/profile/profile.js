import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Form, Grid, Message } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { updateProfile } from '../../actions';
import Avatar from "./avatar";
import FileUpload from './fileUpload';


//Create a schema for validating the form
const schema = yup.object().shape({
  firstName: yup.string().required('Please enter a first name'),
  lastName: yup.string().required('Please enter a last name'),
});

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const profileUpdateError = useSelector((state) => state.auth.error);
  const [formErrorClassName, setFormErrorClassName] = '';
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  //useForm hook to setup the form with yup validation
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (loading && profileUpdateError) {
      setFormErrorClassName('error');
      setErrorMessage(profileUpdateError);
    }
    //eslint-disable-next-line
  }, [profileUpdateError]);

  useEffect(() => {
    console.log('Profile: new user data received');
    setLoading(false);
    if (user) {
      //Display the user's profile in the form
      reset({
        firstName: user.firstName,
        lastName: user.lastName
      });

    }
  }, [user]);

  //Submit form callback to sign up a new user with firebase
  const submitForm = async (data) => {
    console.log('Profile update form:', data);
    formErrorClassName = '';
    setErrorMessage('');

    setLoading(true);

    //Dispatch event to provide profile updates to backend
    dispatch(updateProfile(data));

  }

  const profileForm = () => {
    return (
      <div className='UpdateProfile'>
        <Card className="centered">
          <Card.Content>
            <Card.Header className="centered">Update your profile</Card.Header>
          </Card.Content>
          <Card.Content>
            <Form autoComplete='off'
              onSubmit={handleSubmit(submitForm)}
              className={formErrorClassName}>
              <Form.Field >
                <label>First Name</label>
                <input
                  id='firstName'
                  name='firstName'
                  type='text'
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
                  {...register('lastName', {
                    required: 'Required'
                  })}
                />
                <p>{errors.lastName?.message}</p>
              </Form.Field>

              <Button >Update</Button>
              <Message error header='Profile update failed' content={errorMessage} />
            </Form>
          </Card.Content>
        </Card>
      </div>
    );
  }
  return (
    <>

      <Grid columns={2} stretched stackable>
        <Grid.Column>
          {profileForm()}
        </Grid.Column>
        <Grid.Column>
          <Avatar id={user._id} type={'profile'} />
          <FileUpload />
        </Grid.Column>
      </Grid>


    </>
  );

}
export default Profile;
