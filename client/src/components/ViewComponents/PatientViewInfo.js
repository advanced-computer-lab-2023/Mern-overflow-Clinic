import {
    Input,
    Container,
    Button,
    List,
    ListItem,
    Paper,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    Typography,
  } from "@mui/material";
import {  ListItemText, Collapse, Divider } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
  
  import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
  import React, { useEffect, useState } from "react";
  import Table from "@mui/material/Table";
  import TableBody from "@mui/material/TableBody";
  import TableCell from "@mui/material/TableCell";
  import TableHead from "@mui/material/TableHead";
  import TableRow from "@mui/material/TableRow";
  import axios from "axios";
  import { useParams } from 'react-router-dom';
  import { useUser } from '../../userContest';

  export default function PatientViewInfo() {
    const [data, setData] = useState([]);
    const { userId } = useUser();
    let id = userId;
    const [openEmergency, setOpenEmergency] = React.useState(false);
  const [openFamily, setOpenFamily] = React.useState(false);

  const handleEmergencyClick = () => {
    setOpenEmergency(!openEmergency);
  };

  const handleFamilyClick = () => {
    setOpenFamily(!openFamily);
  };

  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/patients/${id}`)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

useEffect(() => {
  fetchTableData();
}, []);

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
        <Typography variant="h4" style={{ color: '#2196f3' }}>
          User Profile
        </Typography>
        <Divider style={{ margin: '15px 0' }} />

        {/* User Information */}
        <List>
          <ListItem>
            <ListItemText primary="Name" secondary="John Doe" />
          </ListItem>
          <ListItem>
            <ListItemText primary="National ID" secondary="123456789" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Date of Birth" secondary="01/01/1990" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Gender" secondary="Male" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Mobile Number" secondary="123-456-7890" />
          </ListItem>
        </List>

        {/* Emergency Contact */}
        <List>
          <ListItem button onClick={handleEmergencyClick}>
            <ListItemText primary="Emergency Contact" />
            {openEmergency ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openEmergency} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem>
                <ListItemText primary="Mobile" secondary="987-654-3210" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary="emergency@example.com" />
              </ListItem>
            </List>
          </Collapse>
        </List>

        {/* Family Members */}
        <List>
          <ListItem button onClick={handleFamilyClick}>
            <ListItemText primary="Family Members" />
            {openFamily ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openFamily} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* Family Member 1 */}
              <ListItem>
                <ListItemText primary="Name" secondary="Jane Doe" />
              </ListItem>
              <ListItem>
                <ListItemText primary="National ID" secondary="987654321" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Gender" secondary="Female" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Relation" secondary="Spouse" />
              </ListItem>

              {/* Family Member 2 */}
              <ListItem>
                <ListItemText primary="Name" secondary="Tom Doe" />
              </ListItem>
              <ListItem>
                <ListItemText primary="National ID" secondary="789456123" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Gender" secondary="Male" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Relation" secondary="Child" />
              </ListItem>
            </List>
          </Collapse>
        </List>

        {/* Wallet Balance */}
        <ListItem>
          <ListItemText primary="Wallet Balance" secondary="$1000.00" />
        </ListItem>
      </Paper>
    </Container>
  );
      
  }
  