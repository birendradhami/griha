import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  CssBaseline,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import {

} from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideList from "./SideList";
import { useSelector } from "react-redux";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.palette.background.default,
  height: 80,
  justifyContent: "center",
  boxShadow: "none",
  borderBottom: "1px solid #e0e0e0",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Dashboard({ user }) {
  const [open, setOpen] = useState(window.innerWidth >= 1024);
  const [dark, setDark] = useState(true);

  const { currentUser } = useSelector((state) => state.user);

  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? "light" : "dark",
        },
      }),
    [dark]
  );

  const navigate = useNavigate();
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <SideList {...{ open, setOpen, darkTheme, dark, setDark }} />
      </Box>
    </ThemeProvider>
  );
}
