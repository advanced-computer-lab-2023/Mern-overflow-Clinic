import ButtonAppBar from "../../components/ButtonAppBar";
import * as React from "react";
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
import Avatar from "@mui/material/Avatar";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import MedicationIcon from "@mui/icons-material/Medication";
import FileIcon from '@mui/icons-material/InsertDriveFile';
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import TodayIcon from "@mui/icons-material/Today";
import LinkIcon from '@mui/icons-material/Link';
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
        <ButtonAppBar user="Patient" actionButton="Log out" title={props.title}>
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
                    <InfoIcon sx={{ width: 30, height: 30 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="My Information" />
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
                    <HistoryEduIcon sx={{ width: 30, height: 30 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="My Prescriptions" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/patient/linkFamilyMember">
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
                    <LinkIcon sx={{ width: 30, height: 30 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Link Family Members" />
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
          <List>
              <ListItem disablePadding>
                  <ListItemButton component={Link} to='/patient/packages'>
                      <ListItemIcon>
                          <Avatar sx={{ m: 0, bgcolor: 'white', color: 'black', width: 30, height: 30, padding: 0 }}>
                              <InventoryIcon sx={{ width: 30, height: 30 }} />
                          </Avatar>
                      </ListItemIcon>
                      <ListItemText primary="My Packages" />
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
      ) : (
        <p>Excuse me, are you a Patient?</p>
      )}
    </>
  );
};
export default PatientDashboard;
