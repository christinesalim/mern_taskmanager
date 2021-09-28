import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { signOut, signedIn } from '../actions';
import { useAuth } from './firebase/firebaseContext';


const Header = () => {
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const user = useSelector((state) => state.auth.userData);
  const { signOutFirebase, currentUser, idToken } = useAuth();

  console.log("Header Redux state User logged in is: ", user);
  console.log("Header Redux isSignedIn", isSignedIn);
  console.log('Header: Firebase currentUser,uid:', currentUser.email, currentUser.uid);

  useEffect(() => {
    console.log('Header detected currentUser update', currentUser);
    if (currentUser.uid && idToken && !isSignedIn) {
      //Inform backend server a user signed in
      dispatch(signedIn({
        email: currentUser.email
      }));
    }

    //eslint-disable-next-line
  }, [currentUser, idToken])


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