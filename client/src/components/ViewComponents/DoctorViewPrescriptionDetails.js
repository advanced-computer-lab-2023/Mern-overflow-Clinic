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
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MedicationIcon from '@mui/icons-material/Medication';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Grid, Card, CardContent, CardActions, CardActionArea} from '@mui/material';
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
// import EditIcon from "@mui/icons-material/Edit";
import {Snackbar,Alert} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';



const DoctorViewPrescriptionDetails = ({ match }) => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const theme = useTheme();
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
   const [selectedMedicine, setSelectedMedicine] = useState();
   const [selectedIndex, setSelectedIndex] = useState();
   const [input, setInput] = useState({ medName: '', dailyDosage: '', quantity: '' });
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
        fetchPrescription()
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
          setSuccessOpen(true);
          setSuccessMessage("Medicine deleted successfully!");
          setSelectedMedicine(null);
          setSelectedIndex(null);
          fetchPrescription();
          // window.location.reload();
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

      <Container sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
			<Grid container spacing={10} sx={{ width: '100%' }}>
				{/* Left third of the page */}
				<Grid item xs={12} md={4} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* <Grid> */}
					<Card justifyContent="center" alignItems="center" elevation={5} sx={{ maxWidth: 500, width: '150%', height: '40vh', margin: '5em 0em 5em -7.5em', borderRadius: '0.8em', position: 'fixed' }}>
						<CardContent>
								<Typography variant="h5" component="div" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '1.5em', marginTop: '0.5em' }}>
									Add Medicine
								</Typography>
                        <Grid container spacing={2} style={{ width: '80%', marginTop: '0.2em', display: 'flex', 
                                                            justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} >
                                
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <TextField
                                                {...register("medicineName", { required: "medicine is required" })}
                                                fullWidth
                                                sx={{ marginLeft: '3.5em' }}
                                                label={`Medicine Name`}
                                            />
                                        <Grid sx={{ display: 'flex', width: '100%' }}>
                                            <TextField
                                                {...register("dosage", { required: "dosage is required" })}
                                                fullWidth
                                                sx={{ marginTop: '1em', marginLeft: '3.5em' }}
                                                label={`Dosage`}
                                                type='number'
                                            />
                                            <TextField
                                                fullWidth
                                                {...register("quantity", { required: "quantity is required" })}
                                                sx={{ marginTop: '1em', marginLeft: '1em', marginRight: '-3.5em' }}
                                                label={`Quantity`}
                                                type='number'
                                            />
                                            
                                        </Grid>
                                        <Button
                                          type="submit"
                                          variant="outlined"
                                          fullWidth
                                          sx={{ p: 1.8, fontWeight: "bold", mb: 2, marginTop: '1em', marginLeft: '4em' }}
                                        >
                                          Add Medicine
                                        </Button>
                                        </form>
                            </Grid>

						</CardContent>
						<CardActions sx={{ alignItems: 'center', justifyContent: 'center' }}>
              
							<Button variant="contained" onClick={() => handleClick(id)} sx={{ margin: '-2em 1.75em 0.5em 0.5em', width: '75%' }}>
								View Official Prescription Document
							</Button>

						</CardActions>
					</Card>

          {
            selectedMedicine && (
              <Card elevation={5} sx={{ maxWidth: 500, width: '150%', height: '30vh', margin: '30em 0em 5em -7.5em', borderRadius: '0.8em', position: 'fixed' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
										<Typography gutterBottom variant="h5" component="div">
											<MedicationIcon fontSize="large"></MedicationIcon> {selectedMedicine?.name.charAt(0).toUpperCase() + selectedMedicine.name.slice(1).toLowerCase()}
										</Typography>
                    <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0.5em 2em 0.5em 2em'}}>
										<Typography variant="body2">
											<AddAlarmIcon></AddAlarmIcon> {prescription.medicine[selectedIndex]?.dailyDosage} {prescription.medicine[selectedIndex]?.dailyDosage === 1 ? 'dosage' : 'dosages'} per day
										</Typography>
										<Typography variant="body2">
											Used for {selectedMedicine?.medicinalUse} <HelpOutlineIcon></HelpOutlineIcon>
										</Typography>
                    </Grid>
                    <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0.5em 2em 0.5em 2em'}}>
										<Typography variant="body2">
											<AttachMoneyIcon></AttachMoneyIcon> Price: {selectedMedicine?.price}
										</Typography>
										<Typography variant="body2">
											Quantity: {prescription.medicine[selectedIndex]?.quantity} <ShoppingCartIcon></ShoppingCartIcon>
										</Typography>
                    </Grid>
                    <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0.5em 2em 0.5em 2em'}}>
                    <Typography variant="body2">
                      <MedicationLiquidIcon></MedicationLiquidIcon> Medicinal Use: {selectedMedicine?.medicinalUse}
                    </Typography>
                    <Typography variant="body2">
                      Prescription Med: {selectedMedicine?.overTheCounter ? 'No' : 'Yes'} <NoteAddIcon></NoteAddIcon>
                    </Typography>
                    </Grid>
                    <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0.5em 2em 0.5em 2em'}}>
                      <Button variant="contained" onClick={() => handleEditClick(selectedMedicine?._id)} sx={{ margin: '0.5em', width: '80%' }}>
                        Edit Medicine
                      </Button>
                      <Button variant="contained" onClick={() => handleDeleteClick(selectedMedicine?._id)} sx={{ margin: '0.5em', width: '80%', backgroundColor: 'red' }}>
                        Delete Medicine
                      </Button>
                    </Grid>
									</CardContent>
              </Card>
            )
          }

        </Grid>
				{/* Right two thirds of the page */}
				<Grid item xs={12} md={8} >
					<Container elevation={5} sx={{
						display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
						margin: '5em -7.5em 5em 5em', width: '125%', position: 'sticky', maxHeight: '74vh',
						overflow: 'auto', border: '1px solid #ccc', borderRadius: '0.8em',
						'::-webkit-scrollbar': { width: '12px' }, '::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '6px' },
						'::-webkit-scrollbar-track': { backgroundColor: '#eee', borderRadius: '8px' }
					}}>
						{medicine.map((med, index) => (
							<Card key={index} elevation={5} sx={{
								maxWidth: 1000, margin: '2em -3em 2em 0em', width: '75%', borderRadius: '0.8em', transition: 'background-color 0.1s ease-in-out',
								'&:hover': {
									backgroundColor: theme.palette.primary.main, // Change the text color on hover
									color: "white",
								},
							}}>
                <CardActionArea onClick={() => { setSelectedMedicine(med); setSelectedIndex(index); }}>
									<CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
										<Typography gutterBottom variant="h5" component="div">
											<MedicationIcon fontSize="large"></MedicationIcon> {med?.name.charAt(0).toUpperCase() + med.name.slice(1).toLowerCase()}
										</Typography>
										<Typography variant="body2">
											<AddAlarmIcon></AddAlarmIcon> {prescription.medicine[index]?.dailyDosage} {prescription.medicine[index]?.dailyDosage === 1 ? 'dosage' : 'dosages'} per day
										</Typography>
										<Typography variant="body2">
											<HelpOutlineIcon></HelpOutlineIcon> Used for {med?.medicinalUse}
										</Typography>
										<Typography variant="body2">
											<AttachMoneyIcon></AttachMoneyIcon> Price: {med?.price}
										</Typography>
									</CardContent>
                  </CardActionArea>
							</Card>
						))}

					</Container>
				</Grid>
			</Grid>

            {/* Delete Confirmation Dialog  */}
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

      {/* Edit Dialog  */}
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

		</Container>

    </div>
  );
};


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

export default DoctorViewPrescriptionDetails;