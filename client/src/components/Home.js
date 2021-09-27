import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import Auth from './auth/auth';
import '../styles/Home.css';

import Avatar from './avatar/avatar';
import FileUpload from './avatar/fileUpload';

const Home = () => {

  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const user = useSelector((state) => state.auth.userData);

  return (
    <div className="Home">
      {isSignedIn && (
        <>
          <h1 className="Home-h1">Welcome {user?.user?.firstName}!</h1>
          <Grid divided='vertically'>
            <Grid.Row columns={2}>
              <Grid.Column width={2}>
                {/* <Avatar id={user.user._id} type={"profile"} /> */}

              </Grid.Column>
              <Grid.Column width={6}>
                {/* <FileUpload id={user?.user._id} /> */}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>)
      }
      {!isSignedIn && (
        <>
          <Auth />
        </>)
      }

      <p className='Home-Footer'>{'\u00A9'} Christine S. 2021. Built with MongoDB, Express, React and Node.js</p>
    </div>);
};

export default Home;