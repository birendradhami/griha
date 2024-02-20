import { Group, MapsHomeWork, Dashboard } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getRooms } from "../rooms/RoomsActions.jsx";
import { getUsers } from "../users/UsersActions.jsx";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Chart from "./Chart.jsx";
import isAdmin from "../utils/isAdmin.js";

const calculateTotalRoomCostForCurrentUser = (rooms, currentUser) => {
  return rooms
    .filter((room) => room.userRef === currentUser._id)
    .reduce((totalCost, room) => totalCost + room.price, 0);
};

const Overview = ({ setSelectedLink, link }) => {
  const { currentUser, users, rooms } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [totalRoomCost, setTotalRoomCost] = useState(0);

  useEffect(() => {
    const price = calculateTotalRoomCostForCurrentUser(rooms, currentUser);
    setTotalRoomCost(price);
  }, [rooms, currentUser]);

  useEffect(() => {
    setSelectedLink(link);
    if (rooms) getRooms(dispatch, currentUser);
    if (users) getUsers(dispatch, currentUser);
    if (rooms.length === 0) getRooms(dispatch);
    if (users.length === 0) getUsers(dispatch, currentUser);
  }, []);

  return (
    <Box
      sx={{
        display: { xs: "flex", md: "grid" },
        gridTemplateColumns: "repeat(3,1fr)",
        gridAutoRows: "minmax(auto, auto)",
        gap: 3,
        textAlign: "center",
        flexDirection: "column",
        mt: 12,
        overflowX: "auto",
        "@media (max-width: 1024px)": {
          mt: 1,
        },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          display: "none",
          mb: 3,
          mt: 2,
          fontWeight: 400,
          letterSpacing: "-0.6px",
          "@media (max-width: 900px)": {
            display: "block",
          },
        }}
      >
        <Dashboard sx={{ fontSize: 35, mb: 1 }} /> Overview
      </Typography>
      {isAdmin(currentUser) && (
        <>
          <Paper
            elevation={1}
            sx={{
              p: 1,
              "@media (max-width: 1024px)": {
                boxShadow: 1,
                fontSize: 10,
              },
              "@media (max-width: 900px)": {
                p: 0,
                pl: 2,
              },
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Group
                sx={{
                  height: 40,
                  width: 40,
                  opacity: 0.3,
                  ml: 3,
                  "@media (max-width: 1024px)": {
                    height: 64,
                    ml: 0,
                  },
                  "@media (max-width: 600px)": {
                    height: 35,
                    ml: 0,
                  },
                }}
              />
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: 2,
                  fontSize: 19,
                }}
                variant="h6"
              >
                Total Users:
              </Typography>
              <Typography
                variant="h5"
                sx={{ display: "flex", alignItems: "center", ml: 2 }}
              >
                {users.result.length}
              </Typography>
            </Box>
          </Paper>
          <Paper
            elevation={1}
            sx={{
              p: 1,
              "@media (max-width: 1024px)": {
                boxShadow: 1,
              },
              "@media (max-width: 900px)": {
                p: 0,
                pl: 2,
              },
            }}
          >
            <Box sx={{ display: "flex" }}>
              <MapsHomeWork
                sx={{
                  height: 40,
                  width: 40,
                  opacity: 0.3,
                  ml: 3,
                  "@media (max-width: 1024px)": {
                    height: 64,
                    ml: 0,
                  },
                  "@media (max-width: 600px)": {
                    height: 35,
                    ml: 0,
                  },
                }}
              />
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: 2,
                  fontSize: 19,
                }}
                variant="h6"
              >
                Total Rooms:
              </Typography>
              <Typography
                variant="h5"
                sx={{ display: "flex", alignItems: "center", ml: 2 }}
              >
                {rooms.length}
              </Typography>
            </Box>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, gridColumn: 3, gridRow: "1/4" }}>
            <Box>
              <Typography component="h1" variant="h6" sx={{ fontSize: 20 }}>
                Recently added Users
              </Typography>
              <List>
                {users.result.slice(0, 3).map((user, i) => (
                  <Box key={user._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar alt={user?.username} src={user?.avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user?.username}
                        secondary={`Created: ${moment(user?.createdAt).format(
                          "YYYY-MM-DD H:mm:ss"
                        )}`}
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            </Box>
            <Divider sx={{ mt: 2, mb: 2, opacity: 0.7 }} />
            <Box>
              <Typography component="h1" variant="h6" sx={{ fontSize: 20 }}>
                Recently added Rooms
              </Typography>
              <List>
                {rooms.slice(0, 3).map((room, i) => (
                  <Box key={room._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          alt={room?.title}
                          src={room?.imgUrl[0]}
                          variant="rounded"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={room?.title}
                        secondary={`Added: ${moment(
                          room?.createdAt
                        ).fromNow()}`}
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, gridColumn: "1/3", boxShadow: 0 }}>
            <Typography component="h1" variant="h6" sx={{ fontSize: 19 }}>
              Monthly Data Chart
            </Typography>
            <Chart />
          </Paper>
        </>
      )}

      {!isAdmin(currentUser) && (
        <>
          <Paper
            elevation={1}
            sx={{
              p: 1,
              "@media (max-width: 900px)": {
                p: 0,
                pl: 2,
              },
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Group
                sx={{
                  height: 40,
                  width: 40,
                  opacity: 0.3,
                  ml: 3,
                  "@media (max-width: 1024px)": {
                    height: 64,
                    ml: 0,
                  },
                  "@media (max-width: 600px)": {
                    height: 35,
                    ml: 0,
                  },
                }}
              />
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: 2,
                  fontSize: 19,
                }}
                variant="h6"
              >
                Total Rooms:
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: 2,
                  fontSize: 20,
                }}
              >
                {
                  rooms.filter((room) => room.userRef === currentUser._id)
                    .length
                }
              </Typography>
            </Box>
          </Paper>
          <Paper
            elevation={1}
            sx={{
              p: 1,
              "@media (max-width: 900px)": {
                p: 0,
                pl: 2,
              },
            }}
          >
            <Box sx={{ display: "flex" }}>
              <MapsHomeWork
                sx={{
                  height: 40,
                  width: 40,
                  opacity: 0.3,
                  ml: 3,
                  "@media (max-width: 1024px)": {
                    height: 64,
                    ml: 0,
                  },
                  "@media (max-width: 600px)": {
                    height: 35,
                    ml: 0,
                  },
                }}
              />
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: 1,
                  fontSize: 19,
                }}
                variant="h6"
              >
                Total Cost:
              </Typography>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: 1,
                  fontSize: 20,
                }}
                variant="h5"
              >
                Rs.{totalRoomCost}
              </Typography>
            </Box>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, gridColumn: 3, gridRow: "1/4" }}>
            <Box>
              <Typography component="h1" variant="h6" sx={{ fontSize: 20 }}>
                Recently added Rooms
              </Typography>
              {rooms.filter((room) => room.userRef === currentUser._id)
                .length === 0 ? (
                <Typography variant="body2" sx={{ mt: 5 }}>
                  No recent rooms added.
                </Typography>
              ) : (
                <List>
                  {rooms
                    .filter((room) => room.userRef === currentUser._id)
                    .slice(0, 4)
                    .map((room, i) => (
                      <Box key={room._id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              alt={room?.title}
                              src={room?.imgUrl[0]}
                              variant="rounded"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={room?.title}
                            secondary={`Added: ${moment(
                              room?.createdAt
                            ).fromNow()}`}
                          />
                        </ListItem>
                      </Box>
                    ))}
                </List>
              )}
            </Box>
          </Paper>

          <Paper sx={{ p: 2, gridColumn: "1/3", boxShadow: 0 }}>
            <Typography component="h1" variant="h6" sx={{ fontSize: 19 }}>
              Monthly Data Chart
            </Typography>
            <Chart />
          </Paper>
        </>
      )}
    </Box>
  );
};

export default Overview;
