import ButtonAppBar from "../../components/ButtonAppBar";
import SmsIcon from '@mui/icons-material/Sms';
import * as React from "react";
import ContractsIcon from '@mui/icons-material/Description'; // Contracts icon
import AppointmentsIcon from '@mui/icons-material/Event'; // Appointments icon
import FollowUpsIcon from '@mui/icons-material/Assignment'; // Follow-ups icon
import FreeSlotsIcon from '@mui/icons-material/AccessTime'; // Free slots icon
import HealthRecordsIcon from '@mui/icons-material/AssignmentInd'; // Health Records icon
import LockIcon from "@mui/icons-material/Lock"; // Import the Lock icon from MUI
import PersonIcon from "@mui/icons-material/Person"; // Import the Person icon from MUI

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
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import FeedIcon from '@mui/icons-material/Feed';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TodayIcon from "@mui/icons-material/Today";
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import PeopleIcon from "@mui/icons-material/People";
import PostAddIcon from '@mui/icons-material/PostAdd';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useUser } from "../../userContest";
import { RepeatIcon } from "@chakra-ui/icons";
import { More, PostAdd } from "@mui/icons-material";
import PasswordIcon from '@mui/icons-material/Password';

const DoctorDashboard = (props) => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Doctor" ? (
        <ButtonAppBar user="Doctor" actionButton="Log out" title={props.title}>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/doctor/info">
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
              <ListItemButton component={Link} to="/doctor/profile">
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
                   <PersonIcon style={{ color: 'black' }} /> {/* Person icon */}
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Update Profile" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/doctor/contracts">
                <ListItemIcon>
                  <ContractsIcon style={{ color: 'black' }} /> {/* Contracts icon */}
                  
                </ListItemIcon>
                <ListItemText primary="My Contracts" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/doctor/appointments">
                <ListItemIcon>
                  <AppointmentsIcon style={{ color: 'black' }} /> {/* Appointments icon */}
                </ListItemIcon>
                <ListItemText primary="My Appointments" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/doctor/followups">
                <ListItemIcon>
                  <FollowUpsIcon style={{ color: 'black' }} /> {/* Follow-ups icon */}
                </ListItemIcon>
                <ListItemText primary="My Follow Ups" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />

            <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/doctor/patients">
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
                    <PeopleIcon sx={{ width: 25, height: 25 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="My Patients" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/doctor/prescriptions">
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
              <ListItemButton component={Link} to="/doctor/addHealthRecords">
                <ListItemIcon>
                  <HealthRecordsIcon style={{ color: 'black' }} /> {/* Add Health Records icon */}
                </ListItemIcon>
                <ListItemText primary="Add Health Records" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/doctor/freeSlots">
                <ListItemIcon>
                  <FreeSlotsIcon style={{ color: 'black' }} /> {/* Free Slots icon */}
                </ListItemIcon>
                <ListItemText primary="Add Free Slots" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/auth/changepassword">
                <ListItemIcon>
                  <LockIcon style={{ color: 'black' }} /> {/* Lock icon */}
                </ListItemIcon>
                <ListItemText primary="Change My Password" />
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
                <ListItemText primary="Chat/VideoCall Patients" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
        </ButtonAppBar>
      ) : (
        <p>Excuse me, are you a Doctor?</p>
      )}
    </>
  );
  
};
export default DoctorDashboard;
