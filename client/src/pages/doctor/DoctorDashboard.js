import ButtonAppBar from "../../components/ButtonAppBar";
import SmsIcon from '@mui/icons-material/Sms';
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
              <ListItemButton component={Link} to="/doctor/contracts">
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
                    <FeedIcon sx={{ width: 25, height: 25 }} />
                  </Avatar>
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
              <ListItemButton component={Link} to="/doctor/followups">
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
                    <EventRepeatIcon sx={{ width: 25, height: 25 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="My Follow Ups" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />

          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/doctor/pendingFollowUps">
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
                    <PendingActionsIcon sx={{ width: 25, height: 25 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Pending Follow Ups" />
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
                    <PostAddIcon sx={{ width: 25, height: 25 }} />
                  </Avatar>
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
                    <MoreTimeIcon sx={{ width: 25, height: 25 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Add Free Slots" />
              </ListItemButton>
            </ListItem>
          </List>
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
                    <PasswordIcon sx={{ width: 25, height: 25 }} />
                  </Avatar>
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
