import { Input, InputLabel, TextField,  styled, Grid, Select, Accordion, AccordionDetails, AccordionSummary,  Dialog,   DialogTitle,  DialogContent,  DialogActions, MenuItem, Button, Box, Container, FormControl, Typography, Divider, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { capitalize } from "../../utils";
import IconButton from '@mui/material/IconButton';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import {Snackbar,Alert} from '@mui/material';


import axios from "axios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const columns = [
  {
    key: "username",
    label: "USERNAME",
  },
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "email",
    label: "EMAIL",
  },
  {
    key: "dateOfBirth",
    label: "DATE OF BIRTH",
  },
  {
    key: "affiliation",
    label: "AFFILIATION",
  },
  {
    key: "education",
    label: "EDUCATION",
  },
  {
    key: "status",
    label: "STATUS",
  },
  {
    key: "speciality",
    label: "SPECIALITY",
  },
  {
    key: "hourlyrate",
    label: "HOURLY RATE",
  },
  {
    key: "action",
    label: "ACTION",
  },
];

export default function AdminViewDoctors() {
  const [data, setData] = useState([]);
  const [uniqueSpecialties, setUniqueSpecialties] = useState(["No filter"]);
  const [filteredData, setFilteredData] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTableData = () => {
    axios.get(`http://localhost:8000/admins/requests`).then((res) => {
      let temp = ["No filter"];
      res.data.map((key) => {
        if (temp.indexOf(key.speciality) === -1) {
          temp.push(key.speciality);
        }
      });

      setUniqueSpecialties(temp);

      setData(res.data);
      setFilteredData(res.data);
    }).catch(()=>{
      
    });
  };


  const handleAccept = (id) => {
    axios.post(`http://localhost:8000/admins/acceptDoctorRequest`,{id:id})
      .then((response) => {
        setSuccessOpen(true);
        setSuccessMessage("Doctor Accepted Successfully!");
        console.log('POST request successful', response);
        fetchTableData();
      })
      .catch((error) => {
        setErrorOpen(true);
        setErrorMessage("error accepting Doctor!");
        console.error('Error making POST request', error);
      });
  }

  const handleReject= (id) => {
    axios.post(`http://localhost:8000/admins/rejectDoctorRequest`,{id:id})
      .then((response) => {
        setSuccessOpen(true);
        setSuccessMessage("Doctor Rejected Successfully!");
        console.log('POST request successful', response);
        fetchTableData();
      })
      .catch((error) => {
        setErrorOpen(true);
        setErrorMessage("error rejecting Doctor!");
        console.error('Error making POST request', error);
      });
  }

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
  };
  const handleErrorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorOpen(false);
  };

  // return (
  //   <TableContainer component={Paper} style={{ paddingTop: 50 }}>

  //         <Table >
  //           <TableHead>
  //             <StyledTableRow>
  //               {columns.map((column) => (
  //                 <StyledTableCell key={column.key}>{column.label}</StyledTableCell>
  //               ))}
  //             </StyledTableRow>
  //           </TableHead>
  //           <TableBody>
  //             {filteredData.map((row) => (
  //               <StyledTableRow key={row.username}>
  //                 <StyledTableCell>{row.username}</StyledTableCell>
  //                 <StyledTableCell>{row.name}</StyledTableCell>
  //                 <StyledTableCell>{row.email}</StyledTableCell>
  //                 <StyledTableCell>{row.dateOfBirth}</StyledTableCell>
  //                 <StyledTableCell>{row.affiliation}</StyledTableCell>
  //                 <StyledTableCell>{row.education}</StyledTableCell>
  //                 <StyledTableCell>{row.status}</StyledTableCell>
  //                 <StyledTableCell>{row.speciality}</StyledTableCell>
  //                 <StyledTableCell>{row.hourlyRate}</StyledTableCell>
  //                 <StyledTableCell>{
  //                   <ul>
  //                     {row.files.map((file, index) => (
  //                     <li key={index}>{file.filename}
  //                     <a href = {`http://localhost:8000/uploads/` + file.filename} target = "_blank">            View</a></li>
  //                     ))}
  //                   </ul>}
  //                 </StyledTableCell>
  //                 <StyledTableCell>
  //                   <IconButton onClick={() => handleAccept(row._id)}>
  //                     <DoneIcon />
  //                   </IconButton>
  //                 </StyledTableCell>
  //                 <StyledTableCell>
  //                   <IconButton onClick={() => handleReject(row._id)}>
  //                     <ClearIcon />
  //                   </IconButton>
  //                 </StyledTableCell>
  //               </StyledTableRow>
  //             ))}
  //           </TableBody>
  //         </Table>
  //       </TableContainer>
      

  // );


  return (
  

    <Container
                    sx={{
                      p: "20px",
                      my: "40px",
                      paddingBottom: 5,
                      maxWidth: 350,
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
    <Snackbar
      open={successOpen}
      autoHideDuration={3000}
      onClose={handleSuccessClose}
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={handleSuccessClose}
        severity="success"
      >
        {successMessage}
      </Alert>
    </Snackbar>
    <Snackbar
      open={errorOpen}
      autoHideDuration={3000}
      onClose={handleErrorClose}
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={handleErrorClose}
        severity="error"
      >
        {errorMessage}
      </Alert>
    </Snackbar> 
    
    {data.map((row) => {
      return (
        <Paper
        sx={{
          p: 2,
          my: "20px",
          width: "40%",
          maxWidth: "465px",
          flexGrow: 1,
          boxShadow: "none",
        }}
      >
    <Accordion elevation="3">
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      sx={{ py: "20px" }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          fontWeight="bold"
          gutterBottom
          variant="subtitle1"
          component="div"
        >
          {capitalize(row.name)}
        </Typography>
        <Typography variant="body2" gutterBottom>
          email: {row.email}
        </Typography>

        <Button onClick={() => handleAccept(row._id)} style={{ color: 'green' }}>
                                Accept Doctor
                       </Button>
    
        <Button onClick={() => handleReject(row._id)} style={{ color: 'red' }}>
                                Reject Doctor
                       </Button>
    
        <Container
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            justifyItems: "center",
            flexDirection: "column",
          }}
        >
        </Container>
      </Container>
    </AccordionSummary>
    <AccordionDetails>
                                <Typography
                                  variant="body1"
                                  sx={{ textAlign: "left", mb: "5px" }}
                                >
                                  username:{" "} 
                                  {row.username}
                                </Typography>
    
                                <Typography
                                  variant="body1"
                                  sx={{ textAlign: "left", mb: "5px" }}
                                >
                                  dateOfBirth:{" "} 
                                  {row.dateOfBirth}
                                </Typography>

                                <Typography
                                  variant="body1"
                                  sx={{ textAlign: "left", mb: "5px" }}
                                >
                                  affiliation:{" "} 
                                  {row.affiliation}
                                </Typography>
    
                                <Typography
                                  variant="body1"
                                  sx={{ textAlign: "left", mb: "5px" }}
                                >
                                  education:{" "} 
                                  {row.education}
                                </Typography>
    
                                <Typography
                                  variant="body1"
                                  sx={{ textAlign: "left", mb: "5px" }}
                                >
                                  status:{" "} 
                                  {row.status}
                                </Typography>
    
                                <Typography
                                  variant="body1"
                                  sx={{ textAlign: "left", mb: "5px" }}
                                >
                                  speciality:{" "} 
                                  {row.speciality}
                                </Typography>
    
                                <Typography
                                  variant="body1"
                                  sx={{ textAlign: "left", mb: "5px" }}
                                >
                                  hourlyRate:{" "} 
                                  {row.hourlyRate}
                                </Typography>

                                <Typography
                                  variant="body1"
                                  sx={{ textAlign: "left", mb: "5px" }}
                                >
                                  files:{" "} 
                                  <ul>
                                  {row.files.map((file, index) => (
                                    <li key={index}>
                                      {file.filename}
                                      <a href={'http://localhost:8000/uploads/' + file.filename} target="_blank">
                                        View
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                                </Typography>

       </AccordionDetails>                   
    </Accordion>
    </Paper>
      );
    })
    }
    
    {/* <Dialog open={deleteConfirmation.open} onClose={handleDeleteCancel}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this item?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} style={{ color: 'red' }} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog> */}
    
    </Container>
    );



}
