import {
  Group,
  MapsHomeWork,
  Dashboard,
  Money,
  Label,
} from "@mui/icons-material";
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

const Overview = ({ setSelectedLink, link }) => {
  const { currentUser, users, rooms } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [totalRoomCost, setTotalRoomCost] = useState(0);

  useEffect(() => {
    setSelectedLink(link);
    if (rooms) getRooms(dispatch, currentUser);
    if (users) getUsers(dispatch, currentUser);
  }, []);

  const approvedRoomsForCurrentUser = rooms.filter(
    (room) => room.approved && room.userRef === currentUser._id
  );

  const totalCostOfApprovedRooms = approvedRoomsForCurrentUser.reduce(
    (total, room) => total + room.price,
    0
  );

  const pendingRoomsForCurrentUser = rooms.filter(
    (room) => !room.approved && room.userRef === currentUser._id
  );

  const totalCostOfPendingRooms = pendingRoomsForCurrentUser.reduce(
    (total, room) => total + room.price,
    0
  );

  return (
    <>
      <Typography
        variant="h4"
        sx={{
          display: "none",
          mb: 0,
          mt: 3,

          fontWeight: 400,
          letterSpacing: "-0.6px",
          "@media (max-width: 900px)": {
            mb: 5,
            display: "flex",
            justifyContent: "center",
          },
          "@media (max-width: 600px)": {
            width: "99%",
          },
        }}
      >
        <Dashboard sx={{ fontSize: 35, mb: 1 }} /> Overview
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 3,
          textAlign: "center",
          mt: 10,
          overflowX: "auto",
          "@media (max-width: 1024px)": {
            mt: 1,
            flexDirection: "column",
          },
        }}
      >
        {isAdmin(currentUser) && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "70%",
                "@media (max-width: 1024px)": {
                  width: "100%",
                  mx: "auto",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  "@media (max-width: 600px)": {
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  },
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    width: "40%",

                    p: 1,
                    "@media (max-width: 1024px)": {
                      boxShadow: 1,
                      fontSize: 10,
                    },
                    "@media (max-width: 900px)": {
                      p: 0,
                      pl: 2,
                    },
                    "@media (max-width: 600px)": {
                      width: "99%",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      ml: 3,
                      "@media (max-width: 1024px)": {
                        width: "100%",
                        ml: 1,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        fontSize: 21,
                        fontWeight: 500,
                        "@media (max-width: 1024px)": {
                          alignItems: "center",
                        },
                      }}
                    >
                      <Group
                        sx={{
                          height: 30,
                          width: 30,
                          ml: 3,
                          mr: 2,
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
                      Users
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: 2,
                        mt: 1,
                        fontSize: 17,
                        "@media (max-width: 900px)": {
                          ml: 0,

                          fontWeight: 500,
                        },
                      }}
                    >
                      <Label sx={{ mr: 1, fontSize: 18 }} />
                      Basic:
                      {users.filter((user) => user.role === "basic").length}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: 2,
                        fontSize: 17,

                        "@media (max-width: 900px)": {
                          ml: 0,
                          mb: 3,
                          fontWeight: 500,
                        },
                      }}
                    >
                      <Label sx={{ mr: 1, fontSize: 18 }} />
                      Admin:
                      {users.filter((user) => user.role === "admin").length}
                    </Typography>
                  </Box>
                </Paper>

                <Paper
                  elevation={1}
                  sx={{
                    width: "40%",
                    p: 1,
                    "@media (max-width: 1024px)": {
                      boxShadow: 1,
                    },
                    "@media (max-width: 900px)": {
                      p: 0,
                      pl: 2,
                    },
                    "@media (max-width: 600px)": {
                      width: "99%",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      ml: 3,
                      "@media (max-width: 900px)": {
                        ml: 1,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 21,
                        fontWeight: 500,
                        display: "flex",
                        "@media (max-width: 1024px)": {
                          alignItems: "center",
                        },
                      }}
                    >
                      <MapsHomeWork
                        sx={{
                          height: 30,
                          width: 30,
                          ml: 3,
                          mr: 2,

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
                      Rooms
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: 2,
                        fontSize: 17,
                        mt: 1,
                        "@media (max-width: 900px)": {
                          ml: 0,

                          fontWeight: 500,
                        },
                      }}
                    >
                      <Label sx={{ mr: 1, fontSize: 18 }} />
                      Approved:{
                        rooms.filter((room) => room.approved).length
                      }{" "}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: 2,
                        fontSize: 17,
                        "@media (max-width: 900px)": {
                          ml: 0,
                          fontWeight: 500,

                          mb: 3,
                        },
                      }}
                    >
                      <Label sx={{ mr: 1, fontSize: 18 }} />
                      Pending:{
                        rooms.filter((room) => !room.approved).length
                      }{" "}
                    </Typography>
                  </Box>
                </Paper>
              </Box>

              <Paper
                sx={{
                  p: 2,
                  mt: 3,
                  width: "88%",
                  mx: "auto",
                  boxShadow: 0,
                  "@media (max-width: 900px)": {
                    width: "88%",
                    px: 0,
                  },
                  "@media (max-width: 600px)": {
                    width: "100%",
                  },
                }}
              >
                <Typography component="h1" variant="h6" sx={{ fontSize: 19 }}>
                  Monthly Data Chart
                </Typography>
                <Chart />
              </Paper>
            </Box>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                width: "30%",
                "@media (max-width: 1024px)": {
                  width: "90%",
                  mx: "auto",
                },
                "@media (max-width: 600px)": {
                  width: "99%",
                },
              }}
            >
              <Box>
                <Typography component="h1" variant="h6" sx={{ fontSize: 20 }}>
                  Recently added Users
                </Typography>
                <List>
                  {users.slice(0, 3).map((user, i) => (
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
          </>
        )}

        {!isAdmin(currentUser) && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "70%",
                "@media (max-width: 1024px)": {
                  width: "100%",
                  mx: "auto",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  "@media (max-width: 600px)": {
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  },
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    width: "40%",
                    p: 1,
                    "@media (max-width: 1024px)": {
                      boxShadow: 1,
                    },
                    "@media (max-width: 900px)": {
                      p: 0,
                      pl: 2,
                    },
                    "@media (max-width: 600px)": {
                      width: "99%",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      ml: 3,
                      "@media (max-width: 900px)": {
                        ml: 1,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 21,
                        fontWeight: 500,
                        display: "flex",
                        "@media (max-width: 1024px)": {
                          alignItems: "center",
                        },
                      }}
                    >
                      <MapsHomeWork
                        sx={{
                          height: 30,
                          width: 30,
                          ml: 3,
                          mr: 2,

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
                      Rooms
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: 2,
                        fontSize: 17,
                        mt: 1,
                        "@media (max-width: 900px)": {
                          ml: 0,
                          fontWeight: 500,
                        },
                      }}
                    >
                      <Label sx={{ mr: 1, fontSize: 18 }} />
                      Approved:
                      {
                        rooms.filter(
                          (room) =>
                            room.approved && room.userRef === currentUser._id
                        ).length
                      }{" "}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: 2,
                        fontSize: 17,
                        mb: 2,
                        "@media (max-width: 900px)": {
                          ml: 0,
                          fontWeight: 500,

                          mb: 3,
                        },
                      }}
                    >
                      <Label sx={{ mr: 1, fontSize: 18 }} />
                      Pending:
                      {
                        rooms.filter(
                          (room) =>
                            !room.approved && room.userRef === currentUser._id
                        ).length
                      }{" "}
                    </Typography>
                  </Box>
                </Paper>
                <Paper
                  elevation={1}
                  sx={{
                    width: "40%",

                    p: 1,
                    "@media (max-width: 1024px)": {
                      boxShadow: 1,
                      fontSize: 10,
                    },
                    "@media (max-width: 900px)": {
                      p: 0,
                      pl: 2,
                    },
                    "@media (max-width: 600px)": {
                      width: "99%",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      ml: 3,
                      "@media (max-width: 1024px)": {
                        width: "100%",
                        ml: 1,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        fontSize: 21,
                        fontWeight: 500,
                        "@media (max-width: 1024px)": {
                          alignItems: "center",
                        },
                      }}
                    >
                      <Money
                        sx={{
                          height: 30,
                          width: 30,
                          ml: 3,
                          mr: 2,
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
                      Cost
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: 2,
                        mt: 1,
                        fontSize: 17,
                        "@media (max-width: 900px)": {
                          ml: 0,

                          fontWeight: 500,
                          fontSize: 18,
                        },
                      }}
                    >
                      <Label sx={{ mr: 1, fontSize: 18 }} />
                      Approved: Rs.{totalCostOfApprovedRooms}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: 2,
                        fontSize: 17,
                        "@media (max-width: 900px)": {
                          ml: 0,
                          mb: 3,
                          fontWeight: 500,
                        },
                      }}
                    >
                      <Label sx={{ mr: 1, fontSize: 18 }} />
                      Pending: Rs.{totalCostOfPendingRooms}
                    </Typography>
                  </Box>
                </Paper>
              </Box>

              <Paper
                sx={{
                  p: 2,
                  mt: 3,
                  width: "88%",
                  mx: "auto",
                  boxShadow: 0,
                  "@media (max-width: 900px)": {
                    width: "88%",
                    px: 0,
                  },
                  "@media (max-width: 600px)": {
                    width: "100%",
                  },
                }}
              >
                <Typography component="h1" variant="h6" sx={{ fontSize: 19 }}>
                  Monthly Data Chart
                </Typography>
                <Chart />
              </Paper>
            </Box>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                width: "30%",
                "@media (max-width: 1024px)": {
                  width: "90%",
                  mx: "auto",
                },
                "@media (max-width: 600px)": {
                  width: "99%",
                },
              }}
            >
              <Box>
                <Typography component="h1" variant="h6" sx={{ fontSize: 20 }}>
                  Recently added Rooms
                </Typography>
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
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </>
  );
};

export default Overview;
