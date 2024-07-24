import * as React from "react";
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CardMedia,
  Container,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import gymBroLogoSvg from "../assets/icons/arm-logo-svg.svg";
import MuiAppBar from "@mui/material/AppBar";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import {
  ThemeProvider,
  createTheme,
  styled,
  useTheme,
} from "@mui/material/styles";

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { snackBarMessageError } from "../redux/snackbar/snackBarSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../utils/axios";
import LogoAvatarStandard from "../assets/icons/logo_standard.jpg";

const drawerWidth = 240;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Header() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const axiosInterceptor = axiosConfig();
  let history = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await axiosInterceptor.get("/api/auth/signout", {
        withCredentials: true,
      });
      history("/");
      dispatch(signOut());
      //mensagem de logout feito pelo store do snackBarMessageLogout
    } catch (error) {
      dispatch(snackBarMessageError(error.response.data.error));
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ThemeProvider theme={darkTheme}>
        <AppBar position="fixed" open={open}>
          <Toolbar sx={{ display: "flex", minHeight: "64px" }}>
            <Container
              sx={{ display: "flex", alignItems: "center" }}
              maxWidth="false"
            >
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
              {open ? (
                false
              ) : (
                <Link to="/home">
                  <CardMedia
                    sx={{
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      mx: 2,
                      filter: "invert(1)",
                    }}
                    component="img"
                    image={gymBroLogoSvg}
                    alt="Profile img"
                  />
                </Link>
              )}

              {open ? (
                false
              ) : (
                <Link to="/home">
                  <Typography variant="h6" noWrap component="div">
                    Gym Bro
                  </Typography>
                </Link>
              )}
            </Container>

            <Link to="/profile" className="profileMobileMenuOpen">
              <IconButton sx={{ p: 0 }}>
                <Avatar
                  alt="Remy Sharp"
                  src={currentUser.profilePicture || LogoAvatarStandard}
                />
              </IconButton>
            </Link>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={() => open && setOpen(false)}
      >
        <Drawer
          variant="temporary"
          open={open}
          onClose={(_, reason) => reason === "backdropClick" && setOpen(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          anchor="left"
        >
          <DrawerHeader>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ display: "flex", mr: 8 }}
            >
              Menu
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />

          <List>
            <Link to="/workouts" onClick={handleDrawerClose}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {/* <HomeIcon /> */}
                    <CardMedia
                      sx={{
                        width: "1em",
                        height: "1em",
                        display: "inline-block",
                        fontSize: "1.5rem",
                      }}
                      component="img"
                      image={gymBroLogoSvg}
                    />
                  </ListItemIcon>
                  <ListItemText>Adicionar Treino</ListItemText>
                </ListItemButton>
              </ListItem>
            </Link>
          </List>

          <Divider />
          <List>
            <Link to="/home" onClick={handleDrawerClose}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText>Home</ListItemText>
                </ListItemButton>
              </ListItem>
            </Link>

            <Link to="/profile" onClick={handleDrawerClose}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText>Perfil</ListItemText>
                </ListItemButton>
              </ListItem>
            </Link>

            <ListItem disablePadding>
              <ListItemButton onClick={handleSignOut}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText>Sair</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </ClickAwayListener>
    </Box>
  );
}
