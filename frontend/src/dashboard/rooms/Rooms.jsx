import { useEffect, useMemo, useState } from "react";
import { Avatar, Box, Divider, Tooltip, Typography } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import moment from "moment";
import { grey } from "@mui/material/colors";
import RoomsActions from "./RoomsActions.jsx";
import isAdmin from "../utils/isAdmin";
import { useSelector, useDispatch } from "react-redux";
import { getRooms } from "./RoomsActions.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
 CreateOutlined, AddHome
} from "@mui/icons-material";

const Rooms = ({ setSelectedLink, link }) => {
  const { currentUser, rooms } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [pageSize, setPageSize] = useState(5);
  const [userDetails, setUserDetails] = useState({});
  const [userDetailsFetched, setUserDetailsFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedLink(link);
     getRooms(dispatch, currentUser);

    const fetchUserDetails = async () => {
      const userDetailsMap = {};
      const uniqueUserRefs = Array.from(
        new Set(rooms.map((room) => room.userRef))
      );

      for (const userRef of uniqueUserRefs) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/users/${userRef}`
          );
          const { _id, username, avatar } = response.data;
          userDetailsMap[_id] = { username, avatar };
        } catch (error) {
          console.error(
            `Error fetching user details for userRef ${userRef}:`,
            error
          );
        }
      }

      setUserDetails(userDetailsMap);
      setUserDetailsFetched(true);
    };

    fetchUserDetails();
  }, [currentUser]);

  const columns = useMemo(
    () => [
      {
        field: "imgUrl",
        headerName: "Photo",
        width: 80,
        renderCell: (params) => (
          <Avatar src={params.row.imgUrl[0]} variant="rounded" />
        ),
        sortable: false,
        filterable: false,
      },
      {
        field: "price",
        headerName: "Cost",
        width: 100,
        renderCell: (params) => "NPR." + params.row.price,
      },
      { field: "title", headerName: "Title", width: 150 },
      { field: "description", headerName: "Description", width: 150 },
      {
        field: "username",
        headerName: "Added by",
        width: 80,
        renderCell: (params) => (
          <Tooltip title={userDetails[params.row.userRef]?.username}>
            <Avatar src={userDetails[params.row.userRef]?.avatar} />
          </Tooltip>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 100,
        renderCell: (params) =>
          params.row.approved ? "Approved" : "Pending",
      },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 150,
        hide: true, // hide the createdAt field
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 200,
        renderCell: (params) => <RoomsActions {...{ params }} />,
      },
    ],
    [userDetails, rooms]
  );

  const CustomNoRowsOverlay = () => {
    if (!userDetailsFetched) {
      return null;
    }

    return (
      <Box
        sx={{
          width: "100%",
          height: 200,
          fontSize: 18,
          color: "grey",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography >No rooms available.</Typography>
        
      </Box>
    );
  };

  return (
    <Box
      sx={{
        height: 400,
        width: "fit-content",
        mx: "auto",
        "@media (max-width: 1024px)": {
          height: 350,
          width: "100%",
        },
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{
          fontSize: 38,
          fontWeight: 400,
          textAlign: "center",
          mt: 2,
          mb: 3,
          "@media (max-width: 1024px)": {
            fontSize: 30,
            fontWeight: 400,
          },
        }}
      >
        Manage Rooms
      </Typography>
      <Box sx={{width:"15%", boxShadow:2, mx:"auto", "@media (max-width: 1024px)": {
          width:"30%"
        },"@media (max-width: 600px)": {
          width: "55%",
        },}}>
         <Typography
          onClick={() => navigate(`/create_room`)}
          sx={{ cursor: "pointer",textAlign:"center", mt:0, mb:4, }}
        >
          <AddHome sx={{mb:1, mr:0}}/> Create Room
        </Typography>
      </Box>
     
        <Divider/>
      <DataGrid
        columns={columns}
        rows={
          isAdmin(currentUser)
            ? rooms
            : rooms.filter((room) => room.userRef === currentUser._id)
        }
        getRowId={(row) => row._id}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? grey[200] : grey[900],
          },
        }}
      />
    </Box>
  );
};

export default Rooms;
