import ButtonAppBar from "../../components/ButtonAppBar";
import * as React from 'react';
import { Typography, Toolbar, Box, AppBar, IconButton, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, InboxIcon, MailIcon, ListItemText, Divider } from '@mui/material';
import GroupsIcon from "@mui/icons-material/Groups";
import Avatar from '@mui/material/Avatar';
import InventoryIcon from '@mui/icons-material/Inventory';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { Link } from 'react-router-dom';
import PasswordIcon from "@mui/icons-material/Password";


const AdminDashboard = (props) => {
    return (
        <ButtonAppBar user="Admin" actionButton="Log out" title={props.title}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', mt: 2, ml: 2 }}>
                <Avatar sx={{ m: 0, bgcolor: 'white', color: 'black', width: 30, height: 30, padding: 0 }}>
                    <GroupsIcon sx={{ width: 30, height: 30 }} />
                </Avatar>
                <Typography variant="body1" sx={{ fontWeight: "normal", verticalAlign: "text-bottom", ml: 1 }}> System Users</Typography>
            </Box>
            <List>
                {[{ name: 'Admins', route: '/admin/admins' }, { name: 'Pharmacists', route: '/admin/pharmacists' }, { name: 'Patients', route: '/admin/patients' }].map((text, index) => (
                    <ListItem key={text.name} disablePadding>
                        <ListItemButton component={Link} to={text.route} >
                            <ListItemIcon>
                                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                            </ListItemIcon>
                            <ListItemText primary={text.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to='/admin/packages'>
                        <ListItemIcon>
                            <Avatar sx={{ m: 0, bgcolor: 'white', color: 'black', width: 30, height: 30, padding: 0 }}>
                                <InventoryIcon sx={{ width: 25, height: 25 }} />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary="Health Packages" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to='/admin/contracts'>
                        <ListItemIcon>
                            <Avatar sx={{ m: 0, bgcolor: 'white', color: 'black', width: 30, height: 30, padding: 0 }}>
                                <HowToRegIcon sx={{ width: 25, height: 25 }} />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary="Manage Contracts" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to='/admin/doctor-requests'>
                        <ListItemIcon>
                            <Avatar sx={{ m: 0, bgcolor: 'white', color: 'black', width: 30, height: 30, padding: 0 }}>
                                <HowToRegIcon sx={{ width: 25, height: 25 }} />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary="Doctor Requests" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/auth/changepassword">
                        <ListItemIcon>
                            <Avatar
                                sx={{
                                    m: 0,
                                    bgcolor: "white",
                                    color: "black",
                                    width: 30,
                                    height: 30,
                                    padding: 0,
                                }}
                            >
                                <PasswordIcon sx={{ width: 30, height: 30 }} />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary="Change My Password" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
        </ButtonAppBar>
    );
}
export default AdminDashboard;