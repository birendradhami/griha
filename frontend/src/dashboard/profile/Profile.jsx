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
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import EditNoteIcon from '@mui/icons-material/EditNote';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { CenterFocusStrong } from '@mui/icons-material';


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
      <Container sx={{ mt: 10 }}>
        <Grid container spacing={4}>
          {/* Profile picture card */}

          <Grid item xs={12} md={4}>
        
            <Card>
              <CardHeader title="Profile Picture" sx={{ textAlign: 'center' }} />
              <CardContent sx={{ textAlign: 'left', position: 'relative' }}>
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  hidden
                  accept="image/*"
                  type="file"
                  name="profile"
                  id="profile_image"
                  ref={fileRef}
                />
                {/* Profile picture image */}
                <Avatar
                  src={formData.avatar || currentUser.avatar}
                  alt="avatar"
                  sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
                />

                <Typography variant="h5" sx={{ textAlign: 'center' }}>
                  {currentUser.username}
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>{currentUser.role}</Typography>
                {/* Profile picture upload button */}


                <Box
                  sx={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    margin: '0'
                  }}
                >
                  <EditNoteIcon
                    onClick={() => fileRef.current.click()}
                  />
                  
                </Box>
                <Typography variant="body2"  sx={{ textAlign: 'center', fontSize: '0.8rem' }}>
                (Image format must be JPG, PNG)
              </Typography>
                {fileUploadError ? (
                  <Typography variant="caption" sx={{ color: 'red' }} mt={1} >
                    File upload failed
                  </Typography>
                ) : uploadingPerc > 0 && uploadingPerc < 100 ? (
                  <Typography variant="caption" sx={{ color: 'black' }} mt={1} >
                    File uploading...{uploadingPerc}%
                  </Typography>
                ) : uploadingPerc === 100 && (
                  <Typography variant="caption" sx={{ color: 'green' }} mt={1} >
                    File uploaded!!!
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Account details card */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="Account Details" />
              <CardContent>
                <form>
                  {/* Form Group (username) */}

                  <TextField
                    fullWidth
                    label="Username (how your name will appear to other users on the site)"
                    defaultValue={currentUser.username}
                    name="username"
                    type="text"
                    variant="outlined"
                    margin="normal"
                    padding="2px"
                    onChange={handleChange}
                  />

                  {/* Form Group (email address) */}
                  <TextField
                    fullWidth
                    label="Email address"
                    variant="outlined"
                    margin="normal"
                    type="email"
                    defaultValue={currentUser.email}
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


                  {/* Save changes button */}
                  <Box >
                    <Button
                      variant="contained"
                      color="success"
                      type="button"
                      sx={{ m: '5px' }}
                      disabled={loading}
                      onClick={handleSubmit}
                    >
                      {loading ? 'Loading...' : 'Save Changes'}
                    </Button>
                    <Button

                      startIcon={<DeleteIcon />}
                      variant="outlined"
                      color="secondary"
                      type="button"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </Box>




                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Profile