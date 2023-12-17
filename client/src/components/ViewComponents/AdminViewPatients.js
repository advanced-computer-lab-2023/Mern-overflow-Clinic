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
  Collapse,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  InputAdornment,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Snackbar,
  Alert,
  ButtonGroup,
  CircularProgress,
  Grid,
  ButtonBase,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { capitalize } from "../../utils";
import axios from "axios";
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


export default function AdminViewPatients() {
  const [data, setData] = useState([]);
  const [Query, setQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState({});
  // const [open, setOpen] = React.useState(false);
  const [openStates, setOpenStates] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/patients`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error getting Patient data", error);
      });
  };

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
 

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/patients/${id}`)
      .then((response) => {
        console.log("DELETE request successful", response);
        setSuccessOpen(true);
        setSuccessMessage("Patient Deleted successfully!");
        fetchTableData();
      })
      .catch((error) => {
        console.error("Error making DELETE request", error);
      });
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    idToDelete: null,
  });


  // const handleClickDelete = (mid) => {
  //   // const requestData = {
  //   //   mId: mid,
  //   // };
  //   if(!(prescription.filled)){
  //     axios
  //       .delete(`http://localhost:8000/prescriptions/${id}/deleteMedicine/${mid}`)
  //       .then((response) => {
  //         console.log("medicineId:  " + mid);
  //         console.log("DELETE request successful", response);
  //         // fetchTableData();
  //         setSuccessOpen(true);
  //         setSuccessMessage("Medicine deleted successfully!");
  //         fetchPrescription()
  //         // window.location.reload();
  //       })
  //       .catch((error) => {
  //         console.error("Error making DELETE request", error);
  //       });
  //   }
  //   else{
  //     setErrorOpen(true);
  //     setErrorMessage("prescription is already collected!");
  //   }
  // };

  

  
  const handleDeleteClick = (id) => {
    setDeleteConfirmation({
      open: true,
      idToDelete: id,
    });
  };

  const handleDeleteConfirm = () => {
    // Perform delete operation here
    handleDelete(deleteConfirmation.idToDelete);
    // Close the confirmation dialog
    setDeleteConfirmation({
      open: false,
      idToDelete: null,
    });
  };

  const handleDeleteCancel = () => {
    // Close the confirmation dialog without performing delete operation
    setDeleteConfirmation({
      open: false,
      idToDelete: null,
    });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

return (

  <div style={{ textAlign: 'center', paddingTop: '20px' }}>

  <h1>Patients</h1>

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

    <Button onClick={() => handleDeleteClick(row._id)} style={{ color: 'red' }}>
                            Delete Patient
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
                              Username:{" "} 
                              {row.username}
                            </Typography>

                            <Typography
                              variant="body1"
                              sx={{ textAlign: "left", mb: "5px" }}
                            >
                              Gender:{" "} 
                              {row.gender}
                            </Typography>

                            <Typography
                              variant="body1"
                              sx={{ textAlign: "left", mb: "5px" }}
                            >
                              Date Of Birth:{" "} 
                              {formatDate(row.dateOfBirth)}
                            </Typography>

                            <Typography
                              variant="body1"
                              sx={{ textAlign: "left", mb: "5px" }}
                            >
                              Mobile Number:{" "} 
                              {row.mobileNumber}
                            </Typography>

                       <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" gutterBottom>
                            Emergency Contact
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1" sx={{ textAlign: 'left', mb: '5px' }}>
                            Name: {row.emergencyContact.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1" sx={{ textAlign: 'left', mb: '5px' }}>
                            Mobile Number: {row.emergencyContact.mobileNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1" sx={{ textAlign: 'left', mb: '5px' }}>
                            Relation: {row.emergencyContact.relation}
                          </Typography>
                        </Grid>
                      </Grid>
   </AccordionDetails>                   
</Accordion>
</Paper>
  );
})
}

<Dialog open={deleteConfirmation.open} onClose={handleDeleteCancel}>
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
      </Dialog>

</Container>
</div>
);

  

       {/* return (

 {data.map((row) => ( */}
//         <React.Fragment key={row.id}>
//           <TableRow>
//             <TableCell>
//               <IconButton
//                 aria-label="expand row"
//                 size="small"
//                 onClick={() => setOpenStates((prevOpenStates) => {
//                        const updatedOpenStates = [...prevOpenStates];
//                        updatedOpenStates[row.index] = !prevOpenStates[row.index];
//                        return updatedOpenStates;
//                      })}              >
//                 {openStates[row.index] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//               </IconButton>
//             </TableCell>
//             <TableCell component="th" scope="row">
//               {row.name}
//             </TableCell>
//             <TableCell align="right">{row.username}</TableCell>
//             <TableCell align="right">{row.email}</TableCell>
//             <TableCell align="right">{row.dateOfBirth}</TableCell>
//             <TableCell align="right">{row.gender}</TableCell>
//             <TableCell align="right">{row.mobileNumber}</TableCell>
//             <TableCell>
//               <IconButton onClick={() => handleDelete(row._id)}>
//                 <DeleteIcon />
//               </IconButton>
//             </TableCell>
//           </TableRow>
//           {/* Additional row for details */}
//           {openStates[row.index] && (
//             <TableRow>
//               {/* Add your details here */}
//               <TableCell colSpan={7}>Details go here</TableCell>
//             </TableRow>
//           )}
//         </React.Fragment>
//       ))}

//         <TableRow>
//           <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//             <Collapse in={openStates[row.index]} timeout="auto" unmountOnExit>
//               <Box sx={{ margin: 1 }}>
//                 <Typography variant="h6" gutterBottom component="div">
//                   Patient Details
//                 </Typography>
//                 <Table size="small" aria-label="purchases">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Name</TableCell>
//                       <TableCell>email</TableCell>
//                       <TableCell align="right">Date Of Birth</TableCell>
//                       <TableCell align="right">Gender</TableCell>
//                       <TableCell align="right">MobileNumber</TableCell>
//                     <TableCell align="right">EmergencyContact</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {row.map((selectedPatient) => (
//                       <TableRow key={selectedPatient._id}>
//                         <TableCell component="th" scope="row">
//                           {selectedPatient.name}
//                         </TableCell>
//                         <TableCell>{selectedPatient.email}</TableCell>     
//                         <TableCell align="right">{selectedPatient.dateOfBirth}</TableCell>
//                         <TableCell align="right">
//                           {selectedPatient.gender}
//                         </TableCell>
//                         <TableCell align="right">
//                           {selectedPatient.mobileNumber}
//                         </TableCell>
//                        <TableCell align="right">
//                           {selectedPatient.emergencyContact.name}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </Box>
//             </Collapse>
//           </TableCell>
//         </TableRow>
//       </React.Fragment>
//       );
                   
// return (
//   <React.Fragment>

//   {data.map((row) => (
// <TableRow key={row.id}>
// <TableCell>
//   <IconButton
//     aria-label="expand row"
//     size="small"
//     onClick={() => setOpen(!open)}
//   >
//     {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//   </IconButton>
// </TableCell>
// <TableCell component="th" scope="row">
//   {row.name}
// </TableCell>
// <TableCell align="right"l>{row.username}</TableCell>
// <TableCell align="right">{row.email}</TableCell>
// <TableCell align="right">{row.dateOfBirth}</TableCell>
// <TableCell align="right">{row.gender}</TableCell>
// <TableCell align="right">{row.mobileNumber}</TableCell>
// <TableCell>
//   <IconButton onClick={() => handleDelete(row._id)}>
//     <DeleteIcon />
//   </IconButton>
// </TableCell>
// </TableRow>
// ))}

//   <TableRow>
//     <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//       <Collapse in={open} timeout="auto" unmountOnExit>
//         <Box sx={{ margin: 1 }}>
//           <Typography variant="h6" gutterBottom component="div">
//             Patient Details
//           </Typography>
//           <Table size="small" aria-label="purchases">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell>email</TableCell>
//                 <TableCell align="right">Date Of Birth</TableCell>
//                 <TableCell align="right">Gender</TableCell>
//                 <TableCell align="right">MobileNumber</TableCell>
//                 <TableCell align="right">EmergencyContact</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {row.map((selectedPatient) => (
//                 <TableRow key={selectedPatient._id}>
//                   <TableCell component="th" scope="row">
//                     {selectedPatient.name}
//                   </TableCell>
//                   <TableCell>{selectedPatient.email}</TableCell>
//                   <TableCell align="right">{selectedPatient.dateOfBirth}</TableCell>
//                   <TableCell align="right">
//                     {selectedPatient.gender}
//                   </TableCell>
//                   <TableCell align="right">
//                     {selectedPatient.mobileNumber}
//                   </TableCell>
//                   <TableCell align="right">
//                     {selectedPatient.emergencyContact.name}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Box>
//       </Collapse>
//     </TableCell>
//   </TableRow>
// </React.Fragment>
// );

  //}

  // const rows = [
  //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  //   createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  //   createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  //   createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
  // ];

//  function CollapsibleTable() {
//     return (
//       <TableContainer component={Paper}>
//         <Table aria-label="collapsible table">
//           <TableHead>
//             <TableRow>
//               <TableCell />
//               <TableCell>Dessert (100g serving)</TableCell>
//               <TableCell align="right">Calories</TableCell>
//               <TableCell align="right">Fat&nbsp;(g)</TableCell>
//               <TableCell align="right">Carbs&nbsp;(g)</TableCell>
//               <TableCell align="right">Protein&nbsp;(g)</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((row) => (
//               <Row key={row.name} row={row} />
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     );
//   }

}
