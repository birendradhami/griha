import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit, Preview } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getRoomsSuccess } from "../../redux/user/userSlice";

export const getRooms = async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/posts`,
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

  const handlePostDelete = async (postId, currentUser) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/posts/delete/${postId}`,
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
        <IconButton onClick={() => navigate(`/update_post/${params.id}`)}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete this room">
        <IconButton onClick={() => handlePostDelete(params.id)}>
          <Delete />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default RoomsActions;
