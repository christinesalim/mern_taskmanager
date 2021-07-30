import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Popup, Item, Grid, Icon, Image, Confirm } from 'semantic-ui-react';

import Auth from './Auth';
import '../styles/Home.css';
import emptyProfile from '../images/blank-profile-picture.png';
import FileUpload from './fileupload/FileUpload';
import { getAvatarFile, deleteAvatarFile } from '../actions';

const Home = () => {
  const dispatch = useDispatch();
  const isSignedIn = useSelector( (state) => state.auth.isSignedIn);
  const user = useSelector( (state) => state.auth.userData);
  const databaseAvatarInfo = useSelector( state => state.avatar );
  const avatarFile = useRef(databaseAvatarInfo?.file);
  const [ confirmOpen, setConfirmOpen ] = useState(false);
  
  const getAvatar = useCallback(()=> {
    dispatch(getAvatarFile(user.user._id));
  },[user?.user._id, dispatch]);

  useEffect ( () => {   
      if (user){
        console.log("User data changed. Getting avatar for this user");          
        getAvatar();
      }    
  }, [user, getAvatar]);


  const getLatestAvatar = useCallback(() => {
    console.log("*****Avatar was uploaded. Get avatar for this user");
    dispatch(getAvatarFile(user.user._id));
  },[user?.user._id, dispatch]);

  //Update the reference to the avatar file blob so it can be freed
  useEffect(() => {
    avatarFile.current = databaseAvatarInfo.file;
  });
  
  //Get avatar after a new file is uploaded
  useEffect( () => {
    const prevFile = avatarFile.current;
    
    //console.log("Did new file upload?", databaseAvatarInfo.fileUploaded);
    if (user && databaseAvatarInfo.fileUploaded){
      //dispatch(getAvatarFile(user.user._id));
      console.log("Sending request to get user's avatar");
      getLatestAvatar();
    }

    //Clean up function to delete previous file
    return () => {
      console.log("revokeObjectURL", prevFile);    
      URL.revokeObjectURL(prevFile);      
    }
  },[user, databaseAvatarInfo?.fileUploaded, getLatestAvatar])

  const deleteAvatar = () => {
    console.log("Delete the profile");
    dispatch(deleteAvatarFile());
  }  

  const showDeleteAvatarModal = () => {
    setConfirmOpen(true);
  }

  const handleAvatarDeleteCancel = () => {
    setConfirmOpen(false);
  }

  const handleAvatarDeleteConfirm = () => {
    deleteAvatar();
    setConfirmOpen(false);
  }

  return (
  <div className="Home">
    { isSignedIn && (
      <>
      <h1 className="Home-h1">Welcome {user?.user?.firstName}!</h1>
      <Grid divided='vertically'>
        <Grid.Row columns={2}>
          <Grid.Column width={2}>
          {databaseAvatarInfo.file? 
              
                <div className="Home-Icons">
                  <Image 
                    size="tiny" 
                    src={databaseAvatarInfo.file} 
                    alt="avatar" 
                    
                  /> 
                  <Popup content='Delete avatar'
                    trigger={
                      <Icon 
                        size="large"
                        link  
                        name='delete'                     
                        onClick={showDeleteAvatarModal}
                      />
                    }
                  />
                  <Confirm
                    className='Home-Modal'
                    open={confirmOpen}
                    header='Do you want to delete your avatar image?'
                    onCancel={handleAvatarDeleteCancel}
                    onConfirm={handleAvatarDeleteConfirm}
                  />
                </div>
                
              : 
              <Item> <Item.Image size="small" src={emptyProfile} alt="no avatar" circular/></Item> 
              }     
          </Grid.Column>
          <Grid.Column width={6}>
            <FileUpload id={user?.user._id}/> 
          </Grid.Column>       
        </Grid.Row>      
      </Grid>
      </>)
    }
    { !isSignedIn && (
      <>        
        <Auth />
      </>)
    }
    <p className='Home-Footer'>{'\u00A9'} Christine S. 2021. Built with MongoDB, Express, React and Node.js</p>
  </div>);
};

export default Home;