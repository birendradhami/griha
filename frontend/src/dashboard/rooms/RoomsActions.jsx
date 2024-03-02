import {
  Box,
  IconButton,
  Tooltip,
  Dialog,
  Button,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { Delete, Edit, Preview } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getRoomsSuccess } from "../../redux/user/userSlice";

export const getRooms = async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/rooms`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    dispatch(getRoomsSuccess(result));
    return true;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return false;
  }
};

const RoomsActions = ({ params }) => {
  const { _id } = params.row;

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [roomIdToDelete, setroomIdToDelete] = useState(null);

  const handleDeleteWithConfirmation = (roomId) => {
    setroomIdToDelete(roomId);
    setOpen(true);
  };

  const handleDeleteConfirmed = () => {
    handleroomDelete(roomIdToDelete);
    setOpen(false);
  };

  const handleCancelDelete = () => {
    setroomIdToDelete(null);
    setOpen(false);
  };

  const handleroomDelete = async (roomId, currentUser) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/rooms/delete/${roomId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      getRooms(dispatch);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box>
      <Tooltip title="View room details">
        <IconButton onClick={() => navigate(`/listing/${_id}`)}>
          <Preview />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit this room">
        <IconButton onClick={() => navigate(`/update_room/${params.id}`)}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete this room">
        <IconButton onClick={() => handleDeleteWithConfirmation(params.id)}>
          <Delete />
        </IconButton>
      </Tooltip>
      {/* Delete Confirmation Modal */}
      <Dialog
        open={open}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmed} color="primary" autoFocus>
            Yes
          </Button>
          <Button onClick={handleCancelDelete} color="error">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomsActions;
