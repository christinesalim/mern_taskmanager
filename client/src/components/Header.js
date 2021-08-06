import React, { useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { signOut, loadUser } from '../actions';



const Header = () => {
  const dispatch = useDispatch();
  const isSignedIn = useSelector( (state) => state.auth.isSignedIn);
  const user = useSelector( (state) => state.auth.userData);
  console.log("Header User logged in is: ", user);
  console.log("Header isSignedIn", isSignedIn);
  
  
  //If user has a token then consider them signed in when app first starts up
  useEffect(() => {
    console.log("Header dispatching loadUser");
    dispatch(loadUser()); //action creator
  },[dispatch]);



  const handleSignOut = () => {
    if (isSignedIn){
      try {
        //Signout the user
        console.log("Header signing out user");
        dispatch(signOut());
      } catch (e){
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