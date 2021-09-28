import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import Auth from './auth/auth';
import '../styles/Home.css';
import Profile from './profile/profile';

import Avatar from './profile/avatar';
import FileUpload from './profile/fileUpload';

const Home = () => {

  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const user = useSelector((state) => state.auth.userData);
  console.log('Home user:', user);

  return (
    <div className="Home">
      {user ?
        <>
          <h1 className="Home-h1">Welcome {user?.firstName}!</h1>
          <Profile />
          {/* <Grid divided='vertically'>
            <Grid.Row columns={2}>
              <Grid.Column width={2}>
                <Avatar id={user._id} type={"profile"} />

              </Grid.Column>
              <Grid.Column width={6}>
                <FileUpload id={user._id} />
              </Grid.Column>
            </Grid.Row>
          </Grid> */}
        </>
        :
        <>
          <Auth />
        </>
      }
      <p className='Home-Footer'>{'\u00A9'} Christine S. 2021. Built with MongoDB, Express, React and Node.js</p>
    </div>);
};

export default Home;