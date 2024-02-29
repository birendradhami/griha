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
  return (
    <div>
      Profile
    </div>
  )
}

export default Profile
