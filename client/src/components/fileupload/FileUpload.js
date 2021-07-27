import React, { useEffect, useState }from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Label } from 'semantic-ui-react';
import { InputFile } from 'semantic-ui-react-input-file';
import { uploadAvatarFile } from '../../actions';

const MAX_FILE_SIZE = 500000;

const FileUpload = () => {
  const dispatch = useDispatch();
  const [avatarFile, setAvatarFile] = useState(null);
  const [fileName, setFileName] = useState('Upload an image for your profile');
  const [message, setMessage] = useState('');
  const uploadStatus = useSelector( state => state.avatar.uploadStatus);
  const uploadedFileName = useSelector( state=> state.avatar.fileName);

  useEffect( () => {
    console.log("New upload status: ", uploadStatus);
    if (uploadStatus === 200){
      //setMessage("File uploaded successfully");
      setAvatarFile(null);
    } else if (uploadStatus === 400){
      setMessage("Sorry, the file upload had a problem");
    } else {
      setMessage("");
    }
  }, [uploadStatus, uploadedFileName]); 

  useEffect( () => {
    if (!uploadedFileName){
      setFileName('Upload an image for your profile');
    }

  },[uploadedFileName]);
  
  const checkFileSize = (e) => {
    let file = e.target.files[0];
    return file?.size > MAX_FILE_SIZE ? false : true;
  }

  const handleFileSelection = (e) => {
    console.log("Upload this file", e.target.files);
    if (checkFileSize (e)){      
      setAvatarFile(e.target.files[0]);
      setFileName(e.target.files[0]?.name);
      console.log("file name", fileName);
      setMessage("Click the Upload button to begin upload.");
    } else {
      setAvatarFile(null);
      setFileName('Upload an image for your profile:');
      setMessage("File too large. Please select a smaller file to upload");
    }
  }

  const handleUpload = (e) => {

    console.log("uploading file", avatarFile?.name);
    setMessage("");
    const formData = new FormData();
    //This string 'avatar' has to match the multer setting for the post request handler for upload.single('avatar')
    formData.append('avatar', avatarFile);
    dispatch(uploadAvatarFile(fileName, formData));

  }

  return ( 
    <>
      <Form>
        <Label>{fileName}</Label>
        <InputFile            
          input={{
            id: 'avatar-file-id',
            onChange: handleFileSelection            
          }}
        />
      {
        avatarFile && 
        <Button onClick={handleUpload}>Upload</Button>
      }
      </Form>
      <p>{message}</p>
    </>
  );

};

export default FileUpload;