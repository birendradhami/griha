import { React, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { firebaseApp } from "../../firebase.js";
import {
  loddingStart,
  userDeleteFail,
  userDeleteSuccess,
  userUpdateFailed,
  userUpdateSuccess,
} from "../../redux/user/userSlice.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading.jsx";
import { clearSavedListing } from "../../redux/saveListing/saveListingSlice.js";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import EditNoteIcon from "@mui/icons-material/EditNote";
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
} from "@mui/material";
import {
  AddPhotoAlternate,
  BookmarkAdd,
  CenterFocusStrong,
  Edit,
} from "@mui/icons-material";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [uploadingPerc, setUploadingPerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: currentUser.password,
  });
  const [editMode, setEditMode] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(formData.avatar);

  const fileRef = useRef(null);
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileUpload = (file) => {
    if (file) {
      const fireBaseStorage = getStorage(firebaseApp);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(fireBaseStorage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadingPerc(Math.round(progress));
        },
        (error) => {
          setFileUploadError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setFormData({ ...formData, avatar: downloadUrl });
          });
        }
      );
    }
  };

  useEffect(() => {
    handleFileUpload(file);
  }, [file]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loddingStart());
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const userData = await res.json();

      if (userData.success === false) {
        dispatch(userUpdateFailed(userData.message));

        toast.error(userData.message, {
          autoClose: 5000,
        });
      } else {
        dispatch(userUpdateSuccess(userData));
        toast.success("Profile updated successfully", {
          autoClose: 2000,
        });
        setEditMode(false);
      }
    } catch (error) {
      dispatch(userUpdateFailed(error.message));
      toast.error(error.message, {
        autoClose: 2000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(loddingStart());
      const res = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const resData = await res.json();
      if (resData.success === false) {
        dispatch(userDeleteFail(resData.message));

        toast.error(resData.message, {
          autoClose: 2000,
        });
      } else {
        dispatch(userDeleteSuccess());
      }
    } catch (error) {
      dispatch(userDeleteFail(error.message));
      toast.error(error.message, {
        autoClose: 2000,
      });
    }
  };
  const handleCancel = () => {
    setFormData({
      username: currentUser.username,
      email: currentUser.email,
      password: "",
      avatar: currentUser.avatar,
    });
    setFile(undefined);
    setTempAvatar(currentUser.avatar);
    setFileUploadError(false);
    setUploadingPerc(0);
    setEditMode(false);
  };

  return (
    <>
      <Container
        sx={{
          mt: 12,
          width: "100%",
          mx: "auto",
          "@media (max-width: 900px)": {
            p: 0,
            mt: 2,
          },
          "@media (max-width: 600px)": {
            p: 0,
            mt: 2,
          },
        }}
      >
        <Grid container spacing={4} sx={{ alignItems: "center" }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title="Profile Picture"
                sx={{ textAlign: "center" }}
              />
              <CardContent sx={{ textAlign: "left", position: "relative" }}>
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
                  src={formData.avatar || currentUser.avatar}
                  alt="avatar"
                  sx={{
                    width: 90,
                    height: 90,
                    mx: "auto",
                    mb: 0,
                    "@media (max-width: 900px)": {
                      width: 100,
                      height: 100,
                    },
                  }}
                />
                {editMode && (
                  <Box
                    onClick={() => fileRef.current.click()}
                    sx={{
                      cursor: "pointer",
                      textAlign: "center",
                      margin: "0",
                      position: "relative",
                    }}
                  >
                    <Typography
                      sx={{
                        // background: "gray",
                        // color: "white",
                        borderRadius: 5,
                        padding: "2px",
                        width: "10%",
                        mx: "auto",
                        position: "absolute",
                        right: 50,
                        bottom: 10,
                      }}
                    >
                      <BookmarkAdd />
                      {/* Edit */}
                    </Typography>
                  </Box>
                )}
                <Typography variant="h5" sx={{ textAlign: "center", mt: 1 }}>
                  {currentUser.username}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    mt: 2,
                    mb: 1,
                    fontSize: 18,
                    position: "relative",
                  }}
                >
                  {currentUser.role}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", fontSize: "0.8rem" }}
                >
                  (Image format must be JPG, PNG)
                </Typography>
                {fileUploadError ? (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "red",
                      display: "flex",
                      width: "80%",
                      justifyContent: "center",
                      mx: "auto",
                    }}
                    mt={1}
                  >
                    File upload failed
                  </Typography>
                ) : uploadingPerc > 0 && uploadingPerc < 100 ? (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "black",
                      display: "flex",
                      width: "50%",
                      justifyContent: "center",
                      mx: "auto",
                    }}
                    mt={1}
                  >
                    File uploading...{uploadingPerc}%
                  </Typography>
                ) : (
                  uploadingPerc === 100 && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "green",
                        display: "flex",
                        width: "50%",
                        justifyContent: "center",
                        mx: "auto",
                      }}
                      mt={1}
                    >
                      File uploaded!!!
                    </Typography>
                  )
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8} sx={{ width: "60%" }}>
            <Card sx={{ pt: 0 }}>
              <CardHeader title="Account Details" />
              <CardContent sx={{ pt: 0, width: "90%","@media (max-width: 600px)": {
            p: 0,pl:2
          }, }}>
                <form>
                  <TextField
                    fullWidth
                    label="Username (how your name will appear to other users on the site)"
                    value={formData.username}
                    name="username"
                    type="text"
                    margin="normal"
                    padding="1px"
                    onChange={handleChange}
                    disabled={!editMode}
                  />

                  {!editMode && (
                    <TextField
                      fullWidth
                      label="Email address"
                      margin="normal"
                      type="email"
                      value={formData.email}
                      disabled={!editMode}
                      sx={{ p: 0, color: "black" }}
                    />
                  )}
                  
                  {editMode && (
                  <TextField
                    type="password"
                    name="password"
                    value={formData.password}
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    disabled={!editMode}
                    required
                  />)}

                  <Box sx={{display:"flex"}}>
                    {editMode ? (
                      <>
                        <Button
                          variant="contained"
                          type="button"
                          sx={{
                            backgroundColor: "black",
                            color: "white",
                            ":hover": { backgroundColor: "#000" },
                            mr: 2,
                            mt:2,
                          }}
                          onClick={handleSubmit}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="contained"
                          type="button"
                          sx={{
                            backgroundColor: "gray",
                            color: "white",
                            ":hover": { backgroundColor: "#777" },
                            mr: 2,
                            mt:2,
                          }}
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        type="button"
                        sx={{
                          backgroundColor: "black",
                          color: "white",
                          mr: 2,
                          mt:2,
                          ":hover": { backgroundColor: "#000" },
                        }}
                        onClick={handleEdit}
                      >
                        Edit Profile
                      </Button>
                    )}
                    {!editMode && (
                      <Button
                        // startIcon={<DeleteIcon />}
                        type="button"
                        sx={{
                          backgroundColor: "gray",
                          color: "white",
                          mt:2,
                          ":hover": { backgroundColor: "#777" },
                        }}
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    )}
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Profile;
