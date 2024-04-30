import React, { useState, useEffect, Fragment } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText, Modal,
  styled,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import API from "../../API/API_Interface";

import MuiAppBar from "@mui/material/AppBar";

import { AdminMenuItems, EmployeeMenuItems } from "../../Utils/MenuItems";

import Switch from "@mui/material/Switch";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme, darkTheme } from "../../Utils/theme";
import EmployeeNotifications from "../Employee/Notifications/EmployeeNotifications";
import ChangePassword from "./ChangePassword";
import AddTimeOffRequest from "../Employee/Requests/AddTimeOffRequest";
import {FcAbout, FcExpand, FcGenealogy, FcMenu, FcSettings} from "react-icons/fc";

let drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: `${drawerWidth}px`,
    }),
  })
);

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

const notificationsStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function Menu({ user, logoutAction }) {
  const [themeMode, setThemeMode] = useState("lightTheme");
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);
  const [numNotifications, setNumNotifications] = useState(0);
  const [notificationCounts, setNotificationCounts] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleOpenNotifications = () => setNotificationsOpen(true);

  const handleOpenOptions = () => setOptionsOpen(true);

  const handleOpenPassword = () => setChangePasswordOpen(true);
  const handleClosePassword = () => setChangePasswordOpen(false);

  const handleCloseNotifications = () => {
    const setNotificationsRead = async () => {
      const api = new API();
      const notificationsResponse = await api.setNotificationsReadForEmployee(user.employee_id);
    }

    setNotificationsRead()
    setNotificationsOpen(false)
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSelectMenuItem = (idx) => {
    setSelectedMenuItem(idx);
  };

  useEffect(() => {
    const fetchNotificationCount = async (type) => {
      try {
        const api = new API();
        if(type === "availabilityTimeOffPendingCount"){
          const response = await api.availabilityTimeOffPendingCount();
          const notificationCount = response.data[0].total_pending_count;
          setNotificationCounts(prevCounts => ({
            ...prevCounts,
            [type]: notificationCount,
          }));
        }
        else if(type === "punchInPendingCount"){
          const response = await api.punchInPendingCount();
          const notificationCount = response.data[0].count;
          setNotificationCounts(prevCounts => ({
            ...prevCounts,
            [type]: notificationCount,
          }));
        }

      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    async function fetchData() {
      try {
        const api = new API();

        const notificationsResponse = await api.getNotificationsForEmployee(user.employee_id);
        setNotifications(notificationsResponse.data);

        const unreadNotifications = notificationsResponse.data.filter((notification) => notification.unread === 1);
        setNumNotifications(unreadNotifications.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (!notificationsOpen) {
      fetchData();
    }

    // Fetch notification counts for each menu item
    menuItemsForUser().forEach(item => {
      if (item.notifications) {
        fetchNotificationCount(item.notifications);
      }
    });
  }, [notificationsOpen]);

  const toggleThemeMode = () => {
    const newThemeMode =
      themeMode === "lightTheme" ? "darkTheme" : "lightTheme";
    setThemeMode(newThemeMode);
  };

  useEffect(() => {
    const fetchNotificationCount = async (type) => {
      try {
        const api = new API();
        if (type === "availabilityTimeOffPendingCount") {
          const response = await api.availabilityTimeOffPendingCount();
          const notificationCount = response.data[0].total_pending_count;
          setNotificationCounts((prevCounts) => ({
            ...prevCounts,
            [type]: notificationCount,
          }));
        } else if (type === "punchInPendingCount") {
          const response = await api.punchInPendingCount();
          const notificationCount = response.data[0].count;
          setNotificationCounts((prevCounts) => ({
            ...prevCounts,
            [type]: notificationCount,
          }));
        }
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    // Fetch notification counts for each menu item
    menuItemsForUser().forEach((item) => {
      if (item.notifications) {
        fetchNotificationCount(item.notifications);
      }
    });
  }, []);

  const menuItemsForUser = () => {
    return user.permission ? AdminMenuItems() : EmployeeMenuItems();
  };

  return (
    <ThemeProvider theme={themeMode === "darkTheme" ? darkTheme : lightTheme}>
      <CssBaseline />
      <Fragment>
        <AppBar position="static" open={open}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerOpen}
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {menuItemsForUser()[selectedMenuItem].title}
            </Typography>
            {!user.permission && (
                <Fragment>
                  <IconButton
                      size="large"
                      aria-label="show notifications"
                      color="inherit"
                      onClick={handleOpenNotifications}
                  >
                    <Badge badgeContent={numNotifications} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>

                </Fragment>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                m: 1,
              }}
            >
              <Typography variant="h6">
                {`${user.first_name} ${user.last_name}`}
              </Typography>

              <Typography variant="h7" component="div">
                {user.id}
              </Typography>
            </Box>

            <Button color="inherit" onClick={handleOpenOptions}>
              <FcSettings fontSize="26px"></FcSettings>
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
          <Typography
            variant="body1"
            sx={{ marginRight: 0.4 }}
          >
            Dark Mode
          </Typography>
          <Switch
            checked={themeMode === "darkTheme"}
            onChange={toggleThemeMode}
            inputProps={{ "aria-label": "controlled" }}
          />
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
            {menuItemsForUser().map((item, index) => (
              <ListItem
                key={item.title}
                disablePadding
                selected={selectedMenuItem === index}
              >
                <ListItemButton onClick={() => handleSelectMenuItem(index)}>
                  <ListItemIcon sx={{ color: "primary" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                  {item.notifications && (
                    <Badge
                      badgeContent={notificationCounts[item.notifications]}
                      color="error"
                      sx={{
                        fontSize: 16,
                      }}
                    >
                      <NotificationsIcon />
                    </Badge>
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Modal
            open={notificationsOpen}
            onClose={handleCloseNotifications}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
          <Box sx={notificationsStyle}>
            <EmployeeNotifications user={user} sx={{

            }}/>
          </Box>
        </Modal>
        <Modal
            open={optionsOpen}
            onClose={() => setOptionsOpen(false)}
            aria-labelledby="options-modal-title"
            aria-describedby="options-modal-description"
        >
          <Box sx={notificationsStyle}>
            <Typography variant="h6" component="h2">
              Options
            </Typography>
            <List>
              <ListItem button onClick={handleOpenPassword}>
                <ListItemText primary="Change Password" />
              </ListItem>
              <ListItem button onClick={logoutAction}>
                <ListItemText primary="Log Out" />
              </ListItem>
            </List>
          </Box>
        </Modal>
        <Modal
            open={changePasswordOpen}
            onClose={handleClosePassword}
            aria-labelledby="change-password-modal-title"
            aria-describedby="change-password-modal-description"
        >
          <Box sx={notificationsStyle}>
            <ChangePassword user={user} handleClose={handleClosePassword} />
          </Box>
        </Modal>

        <Main open={open}>
          {React.cloneElement(menuItemsForUser()[selectedMenuItem].component, {
            user: user,
          })}
        </Main>
      </Fragment>
    </ThemeProvider>
  );
}
export default Menu;
