import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { signOut, loadedUser } from '../actions';
import { useAuth } from './firebase/firebaseContext';


const Header = () => {
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const user = useSelector((state) => state.auth.userData);
  console.log("Header User logged in is: ", user);
  console.log("Header isSignedIn", isSignedIn);
  const { signOutFirebase, currentUser, idToken } = useAuth();


  console.log('Header: user,uid:', currentUser.email, currentUser.uid);

  // useEffect(() => {
  //   if (currentUser.uid && idToken) {
  //     console.log('Header useEffect dispatching loaded user for uid', currentUser.email);
  //     dispatch(loadedUser(currentUser.email));
  //   }

  //   //eslint-disable-next-line
  // }, [currentUser, idToken])


  const handleSignOut = () => {
    if (isSignedIn) {
      try {
        //Signout the user
        console.log("Header signing out user from firebase and backend");
        signOutFirebase();
        dispatch(signOut());
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <div className="ui secondary pointing menu">
      <Link to="/" className="item">
        TaskManager
      </Link>
      <div className="right menu">
        <Link to="/taskmanager" className="item">
          All Tasks
        </Link>
        {
          isSignedIn ?
            <Button secondary onClick={handleSignOut}>
              Sign Out
            </Button>
            :
            <Button as={Link} to='/auth' primary>
              Log In
            </Button>
        }

      </div>
    </div>
  );
};

export default Header;