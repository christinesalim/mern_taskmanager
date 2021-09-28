import React, { useState, useEffect, useContext, createContext } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebaseConfig';

//Currently authenticated user context shared by the whole app
const AuthContext = createContext(null);

//Hook to get the auth context object and re-render when it changes
export const useAuth = () => {
  //return currently authenticated user
  return useContext(AuthContext);
};

//Provider hook that wraps the app and makes auth object
export function AuthStateProvider({ children }) {
  //Authorization state of user; set to false when not logged in
  const [currentUser, setCurrentUser] = useState(false);
  const [idToken, setIdToken] = useState(null);

  //Sign in with google
  const signInWithGoogleFirebase = () => {
    //Firebase provider for Google log in
    const provider = new GoogleAuthProvider();
    console.log("Firebase.utils Got google auth provider object");
    provider.setCustomParameters({ prompt: 'select_account' });

    return signInWithPopup(auth, provider)
      .then((response) => {
        setCurrentUser(response.user);//successful login
        console.log("Successful login via google", response.user);
        return response.user;
      }).catch((e) => {
        console.log(e);
      });
  }

  //Sign in with email and password
  const signInFirebase = (email, password) => {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        setCurrentUser(response.user);
        return response.user;
      }).catch(e => {
        console.log('signInFirebase error', e);
        throw new Error(e);
      });
  };

  //Sign up new user with email and password
  const signUpFirebase = (email, password) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        setCurrentUser(response.user);
        return response.user;
      }).catch((e) => {
        console.log('signUpFirebase error', e);
        let message;
        const errorCode = e.code;
        if (errorCode === 'auth/weak-password') {
          message = 'The password is too weak';
        } else if (errorCode === 'auth/email-already-in-use') {
          message = 'The email provided is already in use'
        } else if (errorCode === 'auth/invalid-email') {
          message = 'The email provided is invalid'
        } else {
          message = 'Unable to sign up at this time'
        }

        throw new Error(message);
      });
  };


  //Sign out user from Firebase
  const signOutFirebase = () => {
    return auth.signOut()
      .then(() => {
        setCurrentUser(false);
        console.log('Firebase: signed out user');
      }).catch(e => {
        console.log('signOut error', e);
        throw new Error(e);
      });
  }

  //Subscribe to user authorization state changes once when this component mounts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        console.log("Firebase: loaded user", user);

        user.getIdToken(/*forcerefresh*/false).then((token) => {
          //JWT token to send with requests to backend
          setIdToken(token);

          //Save the token in local storage
          localStorage.setItem('taskmanager', JSON.stringify(token));
          console.log('Firebase: Saved JWT token to send to backend');
        }).catch(e => {
          console.log('Unable to get token', e);
        });
      } else {
        setCurrentUser(false);
      }
    });

    //Cleanup subscription on unmount
    return () => unsubscribe();

    // eslint-disable-next-line
  }, []);

  //Subscribe to auth token changes in firebase; tokens expire every hour
  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged((user) => {
      if (user) {
        console.log('FirebaseContext id token changed');
        user.getIdToken(/*forcerefresh*/false).then((token) => {
          //JWT token to send with requests to backend
          setIdToken(token);


          //Save the token in local storage
          localStorage.setItem('taskmanager', JSON.stringify(token));
          console.log('Firebase: Saved REFRESHED JWT token to send to backend');
        });
      }
    });

  }, []);

  const value = {
    currentUser,
    idToken,
    signInWithGoogleFirebase,
    signInFirebase,
    signUpFirebase,
    signOutFirebase
  };

  //Setup the value for the AuthContext and render its children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}