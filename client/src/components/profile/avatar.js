//Displays the user's avatar 

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Popup, Icon, Image, Confirm } from 'semantic-ui-react';

import emptyProfile from '../../images/blank-profile-picture.png';
import { getAvatarFile, deleteAvatarFile } from '../../actions';

//User's id received as props
const Avatar = (props) => {

  const dispatch = useDispatch();
  //Get the avatar data from the redux state store
  const databaseAvatarInfo = useSelector(state => state.avatar);

  const avatarFile = useRef(databaseAvatarInfo?.file);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const getAvatar = useCallback(() => {
    dispatch(getAvatarFile(props.id));
  }, [props.id, dispatch]);

  //On initialization, get the avatar from the backend database
  useEffect(() => {
    const prevFile = avatarFile.current;

    getAvatar();

    //Clean up function to delete previous file
    if (prevFile) {
      return () => {
        URL.revokeObjectURL(prevFile);
      }
    }
  }, [getAvatar]);

  //After a new avatar is uploaded get the latest file from backend
  useEffect(() => {
    if (databaseAvatarInfo.fileUploaded) {
      console.log('Avatar file uploaded so get the latest one');
      getAvatar();
    }
  }, [databaseAvatarInfo.fileUploaded, getAvatar])

  //Handle deleting an avatar image
  const deleteAvatar = () => {
    console.log('Delete the profile image');
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

  //console.log('Avatar: file is ', databaseAvatarInfo.file);
  //Render this component
  return (
    <>
      {databaseAvatarInfo.file ?
        <div className='Home-Icons'>
          <Image
            src={databaseAvatarInfo.file}
            alt='avatar'
            className={props.type === 'avatar' ? 'avatar' : 'medium circular'}
          />
          {props.type === 'profile' &&
            <>
              <Popup content='Delete avatar'
                trigger={
                  <Icon
                    size='large'
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
            </>
          }
        </div>
        :
        <Image
          src={emptyProfile}
          alt="no avatar"
          circular
          className={props.type === 'avatar' ? 'avatar' : 'medium circular'}
        />
      }
    </>
  );

}

export default Avatar;