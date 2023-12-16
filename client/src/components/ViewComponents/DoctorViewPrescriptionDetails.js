import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {  Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, useTheme  } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../../userContest';
import { useForm } from "react-hook-form";
//import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Container,
  TextField,
  FormControl,
  Button,
  MenuItem,
  Select,
  InputLabel,
}from "@mui/material";
import { set } from 'react-hook-form';
//import DeleteIcon from "@mui/icons-material/Delete";
//import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
//import EditIcon from "@mui/icons-material/Edit";
import {Snackbar,Alert} from '@mui/material';



const DoctorViewPrescriptionDetails = ({ match }) => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const {
    register,
    handleSubmit,
    reset, // <-- Add the reset function
    formState: { errors },
  } = useForm();
  const [statusMessage, setStatusMessage] = useState("");
  const doctorId = userId;
  let { id } = useParams();
  
   const [successOpen, setSuccessOpen] = useState(false);
   const [successMessage, setSuccessMessage] = useState("");
   const [errorOpen, setErrorOpen] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const [prescription, setPrescription] = useState([]);
   const [medicine, setMedicine] = useState([]);
   const [mid, setMid] = useState("");
   //const [errorMessage, setErrorMessage] = useState(null);
   //const [oldDosage, setOldDosage] = useState("");


  const fetchPrescription = async () => {
    try {
      console.log("PresID " + id);
      const response = await axios.get(`http://localhost:8000/prescriptions/${id}`);
  
      console.log("HI " + response.data);
      setPrescription(response.data);
  
      
        let medList = [];
  
        for (let i = 0; i < response.data.medicine.length; i++) {
          let mId = response.data.medicine[i].medId;
          console.log("Hello! " + mId);
          const res = await axios.get(`http://localhost:8000/prescriptions/medicineDetails/${mId}`);
          console.log(res.data)
          medList.push(res.data);
        }  
        setMedicine(medList);
    } catch (error) {
      setErrorMessage("Error fetching prescription details");
      console.error("Error fetching prescription details:", error);
    }
  };

  useEffect(() => {
    fetchPrescription();
  }, [doctorId]);

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
  
 

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleClick = (pid) => {
    navigate(`/doctor/prescriptions/${pid}/prescriptionDownload`);
  };

  const onSubmit = (data) => {
    if(! (prescription.filled)){
    const requestData = {
      mName: data.medicineName,
      mDosage: data.dosage,
      mQuantity: data.quantity,
    };

    axios
      .post(`http://localhost:8000/prescriptions/${id}/addMedicine`, requestData)
      .then((response) => {
        setSuccessOpen(true);
        setSuccessMessage("Medicine added successfully!");       
        console.log("POST request successful", response);
        // Reset the form after successful submission
        reset();
        window.location.reload();
        // Optionally, you can handle other actions after resetting the form
      })
      .catch((error) => {
        setErrorOpen(true);
        setErrorMessage("Medicine not correct!");       
        console.error("Error making POST request", error);
      });
    }
    else{
       setErrorOpen(true);
      // setErrorMessage("prescription is already filled");
      setErrorMessage("prescription is already collected!");
    }
  }

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    idToDelete: null,
  });


  const handleClickDelete = (mid) => {
    // const requestData = {
    //   mId: mid,
    // };
    if(!(prescription.filled)){
      axios
        .delete(`http://localhost:8000/prescriptions/${id}/deleteMedicine/${mid}`)
        .then((response) => {
          console.log("medicineId:  " + mid);
          console.log("DELETE request successful", response);
          // fetchTableData();
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error making DELETE request", error);
        });
    }
    else{
      setErrorOpen(true);
      setErrorMessage("prescription is already collected!");
    }
  };

  

  
  const handleDeleteClick = (id) => {
    setDeleteConfirmation({
      open: true,
      idToDelete: id,
    });
  };

  const handleDeleteConfirm = () => {
    // Perform delete operation here
    handleClickDelete(deleteConfirmation.idToDelete);
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

  const [editDialog, setEditDialog] = useState({
    open: false,
    idToEdit: null,
    editedDosage: '',
    editedQuantity: '',
  });

  const handleEditClick = async (id) => {
    setMid(id);
  
    try {
      // Using async/await to fetch the old data
      const oldData = await fetchOldData(id);
      const oldDosageValue = oldData.dosage;
      console.log("oldDosageValue = " + oldDosageValue);
      const oldQuantityValue = oldData.quantity;
  
      setEditDialog({
        open: true,
        idToEdit: id,
        editedDosage: oldDosageValue.toString(),
        editedQuantity: oldQuantityValue.toString(),
      });
    } catch (error) {
      console.error('Error fetching old data:', error);
      // Handle error appropriately
    }
  };

  const fetchOldData = async (mid) => {
    try {
        console.log("Heree ");
        const response = await axios.get(`http://localhost:8000/prescriptions/${id}/medicineDosageQuantity/${mid}`);
        console.log("Response:", response);
        console.log("dosage = " + response.data);
        //setOldDosage(response.data.dosage);
        return {dosage: response.data.dosage, quantity: response.data.quantity};
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

  const handleEditConfirm = () => {
    // Perform edit operation here
    console.log('Edited value:', editDialog.editedDosage);
    // Close the edit dialog
    //setDosage(editDialog.editedValue);

    onSubmitDosage(editDialog.editedDosage, editDialog.editedQuantity);
    setEditDialog({
      open: false,
      idToEdit: null,
      editedDosage: '',
      editedQuantity: '',
    });
  };

  const handleEditCancel = () => {
    // Close the edit dialog without performing edit operation
    setEditDialog({
      open: false,
      idToEdit: null,
      editedDosage: '',
      editedQuantity: '',
    });
  };

  const onSubmitDosage = (dosage, quantity) => {
    const dataToServer = { dosage: dosage, quantity: quantity };
    console.log('Dosage', dosage);
    console.log('mid', mid);
    axios.put(`http://localhost:8000/prescriptions/${id}/update/${mid}`, dataToServer)
        .then((response) => {
            console.log('PUT request successful', response);
            // navigate(`/doctor/prescriptions/${id}`);
            window.location.reload();
          })
        .catch((error) => {
            console.error('Error making PUT request', error);
        });
}

  return (
    <div style={styles.container}>
      {/* {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>} */}
      

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


      {/* <h2>Prescription Details</h2>
    <br></br>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Doctor</th>
            <th style={styles.th}>Patient</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Filled</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>{prescription.doctor?.name}</td>
            <td style={styles.td}>{prescription.patient?.name}</td>
            <td style={styles.td}>{formatDate(prescription?.date)}</td>
            <td style={styles.td}>{prescription.filled ? 'Filled' : 'Not Filled'}</td>
          </tr>
        </tbody>
      </table> */}
      <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: "20px", my: "40px" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add Medicine
        </Typography>
        {/* {statusMessage && (
          <Typography
            variant="body2"
            color={statusMessage.includes("Error") ? "error" : "success"}
            sx={{ mb: 2 }}
          >
            {statusMessage}
          </Typography>
        )} */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Medicine Name"
            {...register("medicineName", { required: "medicine is required" })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Dosage"
            type="number"
            {...register("dosage", { required: "dosage is required" })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Quantity"
            type="number"
            {...register("quantity", { required: "quantity is required" })}
            fullWidth
            sx={{ mb: 2 }}
          />
          {/* {errors.diagnosis && (
            <Typography color="error">{errors.diagnosis.message}</Typography>
          )} */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ p: 1.8, fontWeight: "bold", mb: 2 }}
          >
            Add Medicine
          </Button>
        </form>
      </Paper>
    </Container>

      <br></br>

      <h4>Medicines Details</h4>

      {/* <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Dosage</th>
            <th style={styles.th}>Medicinal Use</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Active Ingredients</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Available Quantity</th>
            <th style={styles.th}>Over The Counter</th>
            <th style={styles.th}>Archived</th>
            <th style={styles.th}>Edit</th>
            <th style={styles.th}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {medicine.map((med, index) => (
            <tr key={index}>
              <td style={styles.td}>{med?.name}</td>
              <td style={styles.td}>{prescription.medicine[index]?.dailyDosage} {prescription.medicine[index]?.dailyDosage === 1 ? 'dosage' : 'dosages'} per day</td>  
              <td style={styles.td}>{med?.medicinalUse}</td>
              <td style={styles.td}>{med?.details.description}</td>
              <td style={styles.td}>{med?.details.activeIngredients.map((ingredient, i) => (
                <li key={i} style={styles.td}>{ingredient}</li>
              ))}</td>
              <td style={styles.td}>{med?.price}</td>
              <td style={styles.td}>{med?.availableQuantity}</td>
              <td style={styles.td}>{med?.overTheCounter ? 'Yes' : 'No' }</td>
              <td style={styles.td}>{med?.isArchived ? 'Yes' : 'No' }</td>
              <td style={styles.td}>
                        <IconButton onClick={() => handleClickEdit(med?._id)}>
                          <EditIcon />
                        </IconButton>
                      </td>
              <td style={styles.td}>
                        <IconButton onClick={() => handleClickDelete(med?._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </td>
            </tr>
          ))}
        </tbody>
      </table> */}

<TableContainer component={Paper}>
      <Table>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Dosage</StyledTableCell>
            <StyledTableCell>Medicinal Use</StyledTableCell>
            <StyledTableCell>Description</StyledTableCell>
            <StyledTableCell>Active Ingredients</StyledTableCell>
            <StyledTableCell>Price</StyledTableCell>
            <StyledTableCell>Quantity</StyledTableCell>
            <StyledTableCell>Over The Counter</StyledTableCell>
            <StyledTableCell>Edit</StyledTableCell>
            <StyledTableCell>Delete</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {medicine.map((med, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{med?.name}</StyledTableCell>
              <StyledTableCell>{prescription.medicine[index]?.dailyDosage} {prescription.medicine[index]?.dailyDosage === 1 ? 'dosage' : 'dosages'} per day</StyledTableCell>
              <StyledTableCell>{med?.medicinalUse}</StyledTableCell>
              <StyledTableCell>{med?.details.description}</StyledTableCell>
              <StyledTableCell>
                <ul>
                  {med?.details.activeIngredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
              </StyledTableCell>
              <StyledTableCell>{med?.price}</StyledTableCell>
              <StyledTableCell>{prescription.medicine[index]?.quantity}</StyledTableCell>
              <StyledTableCell>{med?.overTheCounter ? 'Yes' : 'No' }</StyledTableCell>
              <StyledTableCell>
                <IconButton onClick={() => handleEditClick(med?._id)}>
                  <EditIcon />
                </IconButton>
              </StyledTableCell>
              <StyledTableCell>
                <IconButton onClick={() => handleDeleteClick(med?._id)}>
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      {/* Delete Confirmation Dialog */}
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

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={handleEditCancel}>
        <DialogTitle>Edit Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Dosage"
            variant="outlined"
            fullWidth
            style={{ marginTop: '1em', paddingBottom: '1em' }} 
            value={editDialog.editedDosage}
            onChange={(e) => setEditDialog({ ...editDialog, editedDosage: e.target.value })}
          />
          <TextField
            label="Quantity"
            variant="outlined"
            fullWidth
            style={{ paddingBottom: '1em' }}
            value={editDialog.editedQuantity}
            onChange={(e) => setEditDialog({ ...editDialog, editedQuantity: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditConfirm} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </TableContainer>

    <br></br>


      <button className="btn btn-primary"  onClick={() => handleClick(id)}>
                View Official Prescription Document
              </button>
    </div>
  );
};

// {/* <td style={styles.td}>
// <ul>
//   {medicine.map((med, index) => (
//     <ul key={index} style={styles.td}>
//       {/* Your medicine details here */}
//     </ul>
//   ))}
// </ul>
// </td> */}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: '20px',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    backgroundColor: '#f2f2f2',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #dddddd',
    padding: '8px',
    textAlign: 'left',
  },
};

// const styles = {
//   container: {
//     textAlign: "center",
//     margin: "20px",
//   },
//   header: {
//     fontSize: "1.5rem",
//   },
//   healthRecordsTable: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   recordRow: {
//     borderTop: "15px solid transparent",
//   },
//   errorMessage: {
//     backgroundColor: "lightcoral",
//     padding: "1rem",
//     margin: "1rem",
//   },
// };

export default DoctorViewPrescriptionDetails;