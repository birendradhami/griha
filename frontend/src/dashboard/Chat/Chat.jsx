import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Container,
  Grid,
  CircularProgress,
} from "@mui/material";
import { MarkChatUnread } from "@mui/icons-material";

const Chat = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      navigate('/message');
    }, 4000);

    return () => clearTimeout(redirectTimeout);
  }, [navigate]);

  return (
    <Container sx={{mt:12}}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "50vh" }}
      >
        <Grid item xs={12} textAlign="center">
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Redirecting to Chat!
          </Typography>
        </Grid>

        <Grid item xs={12} textAlign="center" mt={2}>
          <CircularProgress size={24} color="error" />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center" mt={2}>
          <MarkChatUnread sx={{ fontSize: 40 }} />
          <Typography
            sx={{ fontSize: 22, textcolor: "#000", fontWeight:400, ml:1 }}
            onClick={() => navigate("/message")}
          >
            Chat
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
