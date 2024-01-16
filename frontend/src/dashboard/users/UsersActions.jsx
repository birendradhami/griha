import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Fab } from "@mui/material";
import { Check, Save } from "@mui/icons-material";
import { green } from "@mui/material/colors";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getUsersSuccess } from "../../redux/user/userSlice";

export const getUsers = async (dispatch, currentUser) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/users`,
      {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;
    dispatch(getUsersSuccess(result));
    return true;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return false;
  }
};

export const updateStatus = async (userId, data, dispatch, currentUser) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_SERVER_URL}/api/users/updateStatus/${userId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error updating status:", error.message);
    return false;
  }
};

const UsersActions = ({ params, rowId, setRowId }) => {
  const { currentUser, users } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    setLoading(true);
    const { role, active, _id } = params.row;
    const result = await updateStatus(
      _id,
      { role, active },
      dispatch,
      currentUser
    );

    if (result) {
      setSuccess(true);
      setRowId(null);
      await getUsers(dispatch);
      setSuccess(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (rowId === params.id && success) setSuccess(false);
  }, [rowId]);

  return (
    <Box
      sx={{
        m: 1,
        position: "relative",
      }}
    >
      {success ? (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
            bgcolor: green[500],
            "&:hover": { bgcolor: green[700] },
          }}
        >
          <Check />
        </Fab>
      ) : (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
          }}
          disabled={params.id !== rowId || loading}
          onClick={handleSubmit}
        >
          <Save />
        </Fab>
      )}
      {loading && (
        <CircularProgress
          size={52}
          sx={{
            color: green[500],
            position: "absolute",
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};

export default UsersActions;
