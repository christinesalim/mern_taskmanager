import React from 'react';
import { Grid, GridRow, Image } from 'semantic-ui-react';
import SignUp from './signUp';
import SignIn from './signIn';
import '../../styles/Auth.css';
import { useAuth } from '../firebase/firebaseContext';
import logo from '../../images/logo.svg';

const Auth = () => {

  return (
    <div className='Auth-Login'>
      <h3>Sign Up to manage your tasks and get more mental space</h3>
      <Grid >
        <Grid.Row className='divided padded stackable'>
          <Grid.Column className='vertically padded' width={9} >

            <Grid.Row className='ui container' >
              <Image src={logo} alt='logo' className='Auth-Logo centered'></Image>
            </Grid.Row>

            <Grid.Row >
              <SignIn />
            </Grid.Row>

          </Grid.Column>

          <Grid.Column className='vertically padded' width={7}>
            <SignUp />
          </Grid.Column>
        </Grid.Row>
      </Grid>

    </div >
  );

}


export default Auth;
