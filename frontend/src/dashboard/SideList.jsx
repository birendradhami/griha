import {
  Dashboard,
  KingBed,
  Logout,
  MarkChatUnread,
  PeopleAlt,
  Person,
  Brightness4,
  Brightness7,
  CheckBox,
  ApprovalOutlined,
  Recommend,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
  Typography,
  Avatar,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { useMemo, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Overview from "./overview/Overview.jsx";
import Messages from "./messages/Messages";
import Rooms from "./rooms/Rooms";
import Users from "./users/Users";
import Profile from "./profile/Profile.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { signoutFailed, signoutSuccess } from "../redux/user/userSlice.js";
import { Menu } from "@mui/icons-material";
import { useSelector } from "react-redux";
import GrihaLogo from "../../assets/Griha.png";
import isAdmin from "./utils/isAdmin.js";
import Approval from "./approval/Approval.jsx";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(8)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  top: 40,
  borderRight: "none",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
    borderRight: "none",
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
    borderRight: "none",
  }),
}));

const SideList = ({ open, setOpen, darkTheme, dark, setDark }) => {
  const [selectedLink, setSelectedLink] = useState("");
  const dispatch = useDispatch();

  if (!darkTheme) {
    return null;
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("api/auth/signout/:id");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutFailed(data.message));
        toast.error(data.message, {
          autoClose: 2000,
        });
      } else {
        dispatch(signoutSuccess());
        navigate("/");
      }
    } catch (error) {
      dispatch(signoutFailed(error.message));
      toast.error(error.message, {
        autoClose: 2000,
      });
    }
  };

  const list = useMemo(
    () => [
      {
        title: "Overview",
        icon: <Dashboard />,
        link: "",
        component: <Overview {...{ setSelectedLink, link: "" }} />,
        onClick: () => navigate(""),
      },
      ...(isAdmin(currentUser)
        ? [
            
            {
              title: "Users",
              icon: <PeopleAlt />,
              link: "users",
              component: <Users {...{ setSelectedLink, link: "users" }} />,
              onClick: () => navigate("users"),
            },
            {
              title: "Approval",
              icon: <Recommend />,
              link: "approval",
              component: <Approval {...{ setSelectedLink, link: "approval" }} />,
              onClick: () => navigate("approval"),
            },

          ]
        : []),

      

      {
        title: "Profile",
        icon: <Person />,
        link: "profile",
        component: <Profile {...{ setSelectedLink, link: "profile" }} />,
        onClick: () => navigate("profile"),
      },

      {
        title: "Rooms",
        icon: <KingBed />,
        link: "rooms",
        component: <Rooms {...{ setSelectedLink, link: "rooms" }} />,
        onClick: () => navigate("rooms"),
      },

      {
        title: "Messages",
        icon: <MarkChatUnread />,
        link: "messages",
        component: <Messages {...{ setSelectedLink, link: "messages" }} />,
        onClick: () => navigate("messages"),
      },
      {
        title: "Logout",
        icon: <Logout />,
        onClick: async () => {
          await handleLogout();
          navigate("/");
        },
      },
    ],
    [setSelectedLink, currentUser]
  );

  return (
    <>
      <Drawer variant="permanent" open={open} sx={{ "& .MuiDrawer-paper": {} }}>
        <Box
          sx={{
            display: { xs: "none", sm: "none", md: "flex" },
            mt: 4,
            mb: 2,
            justifyContent: "space-around",
            visibility: open ? "visible" : "hidden",
            "@media (max-width: 1024px)": {
              display: open ? "flex" : "none",mt:6
            },
            "@media (max-width: 900px)": {
              mt:2,
            },
          }}
        >
          <Tooltip title="Go back to home page">
            <Typography
              sx={{
                fontSize: 25,
                fontWeight: 700,
                letterSpacing: -1,
                color: darkTheme.palette.text.primary,
                mr: 3,
                ml: 3,
              }}
              onClick={() => navigate("/")}
            >
              Dashboard
            </Typography>
          </Tooltip>

          <IconButton
            onClick={() => setDark(!dark)}
            sx={{
              color: darkTheme.palette.mode === "light" ? "black" : "white",
            }}
          >
            {dark ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
        {/* <Divider /> */}
        <DrawerHeader
          sx={{
            flexDirection: "column",
            mt: 1,
            mb: 1,
            "@media (max-width: 1024px)": {
              mt:"-20px",
            },
            "@media (max-width: 900px)": {
              mt:1,
            },
          }}
        >
          <Avatar src={currentUser?.avatar} sx={{ width: 50, height: 50,
            "@media (max-width: 1024px)": {
              mt:5,
            }, 
                     
          }} />
          {open ? (
            <>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 500,
                  mt: 3,
                  color: darkTheme.palette.text.primary,
                }}
              >
                [{currentUser?.username}:{currentUser?.role || "role"}]
              </Typography>
              <IconButton
                onClick={() => setOpen(false)}
                sx={{ borderRadius: 0 }}
              >
                <Menu
                  sx={{
                    color:
                      darkTheme.palette.mode === "light" ? "black" : "white",
                    fontSize: 25,
                    "@media (min-width: 600px)": {
                      display: "none",
                    },
                  }}
                />
              </IconButton>
            </>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                mt: 1,
                ml: 1,
              }}
            >
              <Menu sx={{ fontSize: 25 }} />
            </IconButton>
          )}
        </DrawerHeader>

        <List sx={{}}>
          {list.map((item) => (
            <ListItem key={item.title} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  mx: 2,
                  "&:hover": {
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light" &&
                      theme.palette.action.hover,
                  },
                  "&.Mui-selected": {
                    backgroundColor: "transparent",
                  },
                }}
                onClick={item.onClick}
                selected={selectedLink === item.link}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color:
                      darkTheme.palette.mode === "light" ? "black" : "white",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    opacity: open ? 1 : 0,
                    fontWeight: "bold",
                    color:
                      darkTheme.palette.mode === "light" ? "black" : "white",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        {/* <DrawerHeader /> */}
        <Routes>
          {list.map((item) => (
            <Route key={item.title} path={item.link} element={item.component} />
          ))}
          <Route path="logout" element={null} />
          <Route
            path="*"
            element={
              isAdmin(currentUser) ? (
                <Overview {...{ setSelectedLink, link: "" }} />
              ) : (
                <Profile {...{ setSelectedLink, link: "profile" }} />
              )
            }
          />
        </Routes>
      </Box>
      <ToastContainer />
    </>
  );
};

export default SideList;
