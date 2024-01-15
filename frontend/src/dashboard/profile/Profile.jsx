import { React, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiFillEdit } from "react-icons/ai";
import { BsFillPlusSquareFill } from 'react-icons/bs'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { firebaseApp } from '../../firebase.js';
import { loddingStart, signoutFailed, signoutSuccess, userDeleteFail, userDeleteSuccess, userUpdateFailed, userUpdateSuccess } from '../../redux/user/userSlice.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import PostCard from '../../components/PostCard.jsx';
import Loading from '../../components/Loading.jsx';
import { clearSavedListing } from '../../redux/saveListing/saveListingSlice.js';
import Footer from '../../components/Footer.jsx';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Avatar,
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Grid,
} from '@mui/material';

const Profile = () => {
  const { currentUser } = useSelector(state => state.user)
  const [file, setFile] = useState(undefined);
  const [uploadingPerc, setUploadingPerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [userPosts, setUserPost] = useState({
    isPostExist: false,
    posts: []
  })

  const [userPostLoading, setUserPostLoading] = useState(false)


  const fileRef = useRef(null);
  const { loading } = useSelector((state => state.user))
  const dispatch = useDispatch();
  const navigate = useNavigate()



  const handleFileUpload = (file) => {
    if (file) {
      const fireBaseStorage = getStorage(firebaseApp);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(fireBaseStorage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadingPerc(Math.round(progress));
        },
        (error) => {
          setFileUploadError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
            setFormData({ ...formData, avatar: downloadUrl });
          });
        }
      );
    }
  }

  useEffect(() => {
    handleFileUpload(file)
  }, [file])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true)
    try {
      dispatch(loddingStart())
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const userData = await res.json();


      //===checking reqest success or not ===//
      if (userData.success === false) {
        dispatch(userUpdateFailed(userData.message))

        //===showing error in tostify====//
        toast.error(userData.message, {
          autoClose: 5000,
        })
      }
      else {
        dispatch(userUpdateSuccess(userData))
        toast.success('Profile updated successfully', {
          autoClose: 2000,
        })
      }
    } catch (error) {
      dispatch(userUpdateFailed(error.message))
      toast.error(error.message, {
        autoClose: 2000,
      })
    }
  }


  const handleDelete = async () => {
    try {
      dispatch(loddingStart())
      const res = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: 'DELETE'
      })
      const resData = await res.json();
      //===checking reqest success or not ===//
      if (resData.success === false) {
        dispatch(userDeleteFail(resData.message))

        //===showing error in tostify====//
        toast.error(resData.message, {
          autoClose: 2000,
        })
      }
      else {
        dispatch(userDeleteSuccess())
      }

    } catch (error) {
      dispatch(userDeleteFail(error.message))
      toast.error(error.message, {
        autoClose: 2000,
      })
    }
  }

  const handleLogOut = async () => {
    try {

      const res = await fetch(`/api/auth/signout/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {

        dispatch(signoutFailed(data.message))
        toast.error(data.message, {
          autoClose: 2000,
        })
      }
      else {
        dispatch(signoutSuccess())
        dispatch(clearSavedListing())
      }
    } catch (error) {
      dispatch(signoutFailed(error.message))
      toast.error(error.message, {
        autoClose: 2000,
      })
    }
  }



  return (
    <>
      <Container maxWidth="xs">
       
        
          <Box p={3}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
              mb={3}
              position="relative"
            >
              <input
                onChange={(e) => setFile(e.target.files[0])}
                hidden
                accept="image/*"
                type="file"
                name="profile"
                id="profile_image"
                ref={fileRef}
              />
              <Avatar
                alt="current user avatar"
                src={formData.avatar || currentUser.avatar}
                onClick={() => fileRef.current.click()}
                sx={{ width: '100px', height: '100px' }}
              />
              <CloudUploadIcon
                sx={{
                  position: 'absolute',
                  bottom: '3px',
                  right: '0',
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
                onClick={() => fileRef.current.click()}
              />
              {fileUploadError ? (
                <Typography variant="caption" color="error" mt={1}>
                  File upload failed
                </Typography>
              ) : uploadingPerc > 0 && uploadingPerc < 100 ? (
                <Typography variant="caption" color="textPrimary" mt={1}>
                  File uploading...{uploadingPerc}%
                </Typography>
              ) : uploadingPerc === 100 && (
                <Typography variant="caption" color="success" mt={1}>
                  File uploaded!!!
                </Typography>
              )}
            </Box>
            <TextField
              defaultValue={currentUser.username}
              name="username"
              type="text"
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              defaultValue={currentUser.email}
              name="email"
              type="email"
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              type="password"
              name="password"
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />
            <Button
              disabled={loading}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 4 }}
              onClick={handleSubmit}
            >
              {loading ? 'Loading...' : 'Save Changes'}
            </Button>
         
         
            <Button onClick={handleLogOut} variant="contained" color="primary" fullWidth sx={{ mt: { xs: 2, xl: 0 }, mr: { xs: 0, xl: 2 } }}>
              Log Out
            </Button>
            <Button onClick={handleDelete} variant="contained" color="primary" fullWidth sx={{ mt: { xs: 2, xl: 0 } }}>
              Delete
            </Button>
            </Box>
       
      </Container>
    </>
  )
}

export default Profile
