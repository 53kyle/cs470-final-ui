import React, { useState, Fragment } from 'react';
import {Badge, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Toolbar, Typography, useTheme} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications"
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import MuiAppBar from '@mui/material/AppBar';

import {AdminMenuItems, EmployeeMenuItems} from "../../Utils/MenuItems";

let drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: `${drawerWidth}px`,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function Menu({user, logoutAction}) {
    const theme = useTheme();

    const [open, setOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState(0);
    const [numNotifications, setNumNotifications] = useState(0);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleSelectMenuItem = (idx) => {
        setSelectedMenuItem(idx);
    }

    const menuItemsForUser = () => {
        return user.permission ? AdminMenuItems() : EmployeeMenuItems();
    }

    return (
        <Fragment>
            <AppBar position="static" open={open}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerOpen}
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {
                            menuItemsForUser()[selectedMenuItem].title
                        }
                    </Typography>

                    <IconButton
                        size="large"
                        aria-label="show notifications"
                        color="inherit"
                    >
                        {
                            <Badge badgeContent={numNotifications} color="error">
                                <NotificationsIcon/>
                            </Badge>
                        }
                    </IconButton>

                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        m: 1
                    }}>
                        <Typography variant="h6" component="div">
                            {
                                `${user.first_name} ${user.last_name}`
                            }
                        </Typography>

                        <Typography variant="h7" component="div">
                            {
                                user.id
                            }
                        </Typography>
                    </Box>

                    <Button color="inherit" onClick={logoutAction}>Log Out</Button>
                </Toolbar>
            </AppBar>

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>

                <Divider />

                <List>
                    {menuItemsForUser().map((item, index) => (
                        <ListItem key={item.title} disablePadding selected={selectedMenuItem === index}>
                            <ListItemButton
                                onClick={ () => handleSelectMenuItem(index) }
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Main open={open}>
                {
                    React.cloneElement(menuItemsForUser()[selectedMenuItem].component, { user: user })
                }
            </Main>
        </Fragment>
    );
}
export default Menu;