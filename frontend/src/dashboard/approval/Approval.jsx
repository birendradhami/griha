import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IconButton,
  Typography,
  Paper,
  Button,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Approval = () => {
  const [roomRequests, setRoomRequests] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    fetchRoomRequests();
  }, []);

  const fetchRoomRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/rooms`
      );
      const notApprovedRequests = response.data.filter(
        (request) => !request.approved
      );
      setRoomRequests(notApprovedRequests);
    } catch (error) {
      console.error("Error fetching room requests:", error.message);
    }
  };

  const sendApprovalEmail = async (userEmail) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/mail/send-approval-email`,
        {
          to: userEmail,
          subject: "Your room has been approved",
          text: "Congratulations! Your room has been approved.",
        }
      );
    } catch (error) {
      console.error("Error sending approval email:", error.message);
    }
  };

  const sendDenialEmail = async (userEmail) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/mail/send-denial-email`,
        {
          to: userEmail,
          subject: "Your room has been denied",
          text: "Unfortunately, your room has been denied.",
        }
      );
    } catch (error) {
      console.error("Error sending denial email:", error.message);
    }
  };

  const handleApprove = async (requestId, userRef) => {
    try {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/api/rooms/approve/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const userResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/users/${userRef}`
      );
      const userEmail = userResponse.data.email;

      await sendApprovalEmail(userEmail);

      const updatedRequests = roomRequests.filter(
        (request) => request._id !== requestId
      );
      setRoomRequests(updatedRequests);
    } catch (error) {
      console.error("Error approving room:", error.message);
    }
  };

  const handleDeny = async (requestId, userRef) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/rooms/delete/${requestId}`,
        {
          method: "DELETE",
        }
      );

      const userResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/users/${userRef}`
      );
      const userEmail = userResponse.data.email;

      await sendDenialEmail(userEmail);

      fetchRoomRequests();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Typography
        variant="h3"
        component="h3"
        sx={{
          fontSize: 38,
          fontWeight: 400,
          textAlign: "center",
          mt: 3,
          mb: 8,
          "@media (max-width: 1024px)": {
            fontSize: 30,
            fontWeight: 400,
          },
        }}
      >
        Rooms Approval
      </Typography>

      {roomRequests.length === 0 ? (
        <Typography variant="body1" textAlign="center" sx={{ mt: 10 }}>
          Nothing to approve.
        </Typography>
      ) : (
        roomRequests.map((request, index) => (
          <Paper
            key={request._id}
            elevation={0}
            sx={{
              padding: 1,
              marginBottom: 2,
              display: "flex",
              justifyContent:"center",
              width: "70%",
              mx: 20,
              // boxShadow:1,
              alignItems: "center",
              "@media (max-width: 900px)": {
                flexDirection:"column",
                mx:"auto"
              },
              "@media (max-width: 600px)": {
                width: "100%"
              },
            }}
          >
            <Typography
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            mr:3,
            fontSize: 16,
            fontWeight: 'bold',
            "@media (max-width: 1024px)": {
              display:"none"
            },
          }}
        >
          {index + 1}
        </Typography>
            
            <div>
              <Typography sx={{fontSize:18, fontWeight:500}} gutterBottom>
                Title: {request.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                ID: {request._id}
              </Typography>
            </div>
            {!request.approved && (
              <div>
                <IconButton
                  sx={{ ml: 2 ,"@media (max-width: 900px)": {
                   ml:0
                  },}}
                  onClick={() => navigate(`/listing/${request._id}`)}
                >
                  <Visibility />
                </IconButton>
                <Button
                  sx={{ ml: 1, backgroundColor:"gray",color:"white", ":hover" :{backgroundColor:'#777'} }}
                  onClick={() => handleApprove(request._id, request.userRef)}
                >
                  Approve
                </Button>
                <Button
                  sx={{ ml: 1, backgroundColor:"black" }}
                  onClick={() => handleDeny(request._id, request.userRef)}
                  variant="contained"
                  color="error"
                >
                  Deny
                </Button>
              </div>
            )}
            <Divider sx={{ marginY: 2 }} />
          </Paper>
        ))
      )}
    </div>
  );
};

export default Approval;
