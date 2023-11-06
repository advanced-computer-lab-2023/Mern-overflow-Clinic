import ButtonAppBar from "../../components/ButtonAppBar";
import * as React from 'react';
import { Typography, Toolbar, Box, AppBar, IconButton, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, InboxIcon, MailIcon, ListItemText, Divider } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import MedicationIcon from '@mui/icons-material/Medication';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import TodayIcon from '@mui/icons-material/Today';
import { Link } from 'react-router-dom';

const PatientDashboard = (props) => {
    return (
        <ButtonAppBar user="Patient" actionButton="Log out" title={props.title}>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to='/patient/info'>
                        <ListItemIcon>
                            <Avatar sx={{ m: 0, bgcolor: 'white', color: 'black', width: 30, height: 30, padding: 0 }}>
                                <MedicationIcon sx={{ width: 30, height: 30 }} />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary="My Information" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to='/patient/family'>
                        <ListItemIcon>
                            <Avatar sx={{ m: 0, bgcolor: 'white', color: 'black', width: 30, height: 30, padding: 0 }}>
                                <FamilyRestroomIcon sx={{ width: 30, height: 30 }} />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary="Family" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to='/patient/doctors'>
                        <ListItemIcon>
                            <Avatar sx={{ m: 0, bgcolor: 'white', color: 'black', width: 30, height: 30, padding: 0 }}>
                                <AccountBoxIcon sx={{ width: 30, height: 30 }} />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary="Doctors" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to='/patient/appointments'>
                        <ListItemIcon>
                            <Avatar sx={{ m: 0, bgcolor: 'white', color: 'black', width: 30, height: 30, padding: 0 }}>
                                <TodayIcon sx={{ width: 30, height: 30 }} />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary="My Appointments" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to='/patient/prescriptions'>
                        <ListItemIcon>
                            <Avatar sx={{ m: 0, bgcolor: 'white', color: 'black', width: 30, height: 30, padding: 0 }}>
                                <MedicationIcon sx={{ width: 30, height: 30 }} />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary="My Prescriptions" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to='/patient/documents'>
                        <ListItemIcon>
                            <Avatar sx={{ m: 0, bgcolor: 'white', color: 'black', width: 30, height: 30, padding: 0 }}>
                                <FileIcon sx={{ width: 30, height: 30 }} />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary="My Documents" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
        </ButtonAppBar>
    );
}
export default PatientDashboard;