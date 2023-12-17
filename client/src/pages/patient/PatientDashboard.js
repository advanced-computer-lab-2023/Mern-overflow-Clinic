import ButtonAppBar from "../../components/ButtonAppBar";
import * as React from "react";
import SmsIcon from '@mui/icons-material/Sms';
import {
  Typography,
  Toolbar,
  Box,
  AppBar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  InboxIcon,
  MailIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import Avatar from "@mui/material/Avatar";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import MedicationIcon from "@mui/icons-material/Medication";
import FileIcon from '@mui/icons-material/InsertDriveFile';
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DescriptionIcon from '@mui/icons-material/Description';
import TodayIcon from "@mui/icons-material/Today";
import LinkIcon from '@mui/icons-material/Link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import PasswordIcon from '@mui/icons-material/Password';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Link } from "react-router-dom";
import { useUser } from "../../userContest";

const PatientDashboard = (props) => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Patient" ? (
        <ButtonAppBar user="Patient" actionButton="Log out" title={props.title} sx={{ position: 'fixed', width: '100%', zIndex: '1000' }} >
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/patient/info">
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
                    <AccountCircleIcon sx={{ width: 25, height: 25 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/patient/family">
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
                    <FamilyRestroomIcon sx={{ width: 25, height: 25 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Family" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/patient/doctors">
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
                    <AccountBoxIcon sx={{ width: 25, height: 25 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Doctors" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/patient/appointments">
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
                    <TodayIcon sx={{ width: 25, height: 25 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="My Appointments" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/patient/healthRecords">
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
                    <DescriptionIcon sx={{ width: 25, height: 25 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="My Health Records" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/patient/prescriptions">
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
                    <HistoryEduIcon sx={{ width: 25, height: 25 }} />
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
                              <FileIcon sx={{ width: 25, height: 25 }} />
                          </Avatar>
                      </ListItemIcon>
                      <ListItemText primary="My Documents" />
                  </ListItemButton>
              </ListItem>
          </List>
          <Divider />
          <List>
              <ListItem disablePadding>
                  <ListItemButton component={Link} to='/patient/packages'>
                      <ListItemIcon>
                          <Avatar sx={{ m: 0, bgcolor: 'white', color: 'black', width: 30, height: 30, padding: 0 }}>
                              <InventoryIcon sx={{ width: 25, height: 25 }} />
                          </Avatar>
                      </ListItemIcon>
                      <ListItemText primary="My Packages" />
                  </ListItemButton>
              </ListItem>
          </List>
          <List>
              <ListItem disablePadding>
                  <ListItemButton component={Link} to='/patient/followups'>
                      <ListItemIcon>
                          <Avatar sx={{ m: 0, bgcolor: 'white', color: 'black', width: 30, height: 30, padding: 0 }}>
                              <EventRepeatIcon sx={{ width: 25, height: 25 }} />
                          </Avatar>
                      </ListItemIcon>
                      <ListItemText primary="FollowUps" />
                  </ListItemButton>
              </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/chat">
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
                    <SmsIcon sx={{ width: 25, height: 25 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Chat/Videocall Doctors" />
              </ListItemButton>
            </ListItem>
          </List>
        </ButtonAppBar>
      ) : (
        <p>Excuse me, are you a Patient?</p>
      )}
    </>
  );
};
export default PatientDashboard;
