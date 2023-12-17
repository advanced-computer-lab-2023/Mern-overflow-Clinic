import { Box, Typography, Grid, FormControl, Button, Container, Paper, TextField, Select, MenuItem } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment'; import axios from 'axios';
import { set, useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { useUser } from "../../userContest";
import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import RemoveIcon from '@mui/icons-material/Remove';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

const AddPrescription = () => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [patients, setPatients] = useState([]);
    const [inputs, setInputs] = useState([{ medName: '', dailyDosage: '', quantity: '' }]); // State to keep track of input values
    const [selectedPatient, setselectedPatient] = useState();
    const { userId } = useUser();
    const [successOpen, setSuccessOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorOpen, setErrorOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
    // const id = "655089b786a7e9fff5d1d36a";
    const id = userId;

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

    const fetchTableData = () => {
        axios
            .get(`http://localhost:8000/doctors/${id}/patients`, {
                params: { id: id },
            })
            .then((res) => {
                // console.log("Hello:  ok; "+res.data);
                // console.log("Hererrrrrrrrrrrrreeee: "+(res.data)[1].healthRecords.length);
                setPatients(res.data);
            })
            .catch((error) => {
                console.error("Error getting Patient data", error);
            });
    };

    useEffect(() => {
        fetchTableData();
    }, []);

    const handleInputChange = (index, fieldName, value) => {
        const newInputs = [...inputs];
        newInputs[index][fieldName] = value;
        setInputs(newInputs);
    };

    const handleAddInput = () => {
        setInputs([...inputs, { medName: '', dailyDosage: '', quantity: '' }]);
    };

    const handleRemoveInput = (index) => {
        const newInputs = [...inputs];
        newInputs.splice(index, 1);
        setInputs(newInputs);
    };

    const handleDropdownChange = (event) => {
        setselectedPatient(event.target.value);
    };


    const onSubmit = data => {
        const patientId = selectedPatient;
        if (selectedPatient === undefined) {
            setErrorMessage("Please select a patient");
            setErrorOpen(true);
            return;
        }
        console.log("Patient ID: " + patientId);
        const medicines = [];
        for (const input of inputs) {
            console.log("Input: " + JSON.stringify(input));
            if (input.medName === '' && input.dailyDosage === '' && input.quantity === '') {
                continue;
            }
            if (input.medName === '' || input.dailyDosage === '' || input.quantity === '') {
                setErrorMessage("Please fill all the fields");
                setErrorOpen(true);
                return;
            }
            medicines.push({ medName: input.medName, dailyDosage: input.dailyDosage, quantity: input.quantity });
        }
        console.log("Medicines: " + JSON.stringify(medicines));
        if (medicines.length === 0) {
            setErrorMessage("You cannot add an empty prescription");
            setErrorOpen(true);
            return;
        }


        // console.log("DATA:  Packs: "+JSON.stringify(dataToServer));
        axios.post(`http://localhost:8000/prescriptions/doctors/${id}/patients/${patientId}/addPrescription`, { medicines: medicines })
            .then((response) => {
                console.log('POST request successful', response);
            })
            .catch((error) => {
                console.error('Error making POST request', error);
            });
        window.location.reload();
    }


    return (

        // {/* Left third of the page */ }
        <Grid item xs={12} md={4} sx={{ width: '100%' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
            <Card elevation={5} sx={{ maxWidth: 500, width: '150%', height: '70vh', margin: '5em 0em 5em -7.5em',
                borderRadius: '0.8em', overflow: 'auto', position: 'fixed', alignItems: 'center', justifyContent: 'center' }}>
                <CardContent>
                    <Container sx={{ width: "100%", display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '3em', marginTop: '0.5em' }}>
                            Add a New Prescription
                        </Typography>
                        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid item xs={12}>
                                <Select
                                    fullWidth
                                    label="Patient Name"
                                    value={selectedPatient}
                                    onChange={handleDropdownChange}
                                >

                                    {/* {console.log("Patients: "+JSON.stringify(patients))} */}
                                    {patients.map((patient, index) => (
                                        <MenuItem value={patient._id}>{patient.name}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>

                        <Container sx={{ width: '110%', marginLeft: '-1.3em', height: '30vh', overflow: 'auto', marginTop: '2em', border: '1px solid #ccc', borderRadius: '0.8em',
                        '::-webkit-scrollbar': {width: '12px'}, 
                        '::-webkit-scrollbar-thumb': {backgroundColor: '#888', borderRadius: '6px'},
                        '::-webkit-scrollbar-track': {backgroundColor: '#eee', borderRadius: '8px'}}}>
                        {inputs.map((input, index) => (

                            <Grid container spacing={2} key={index} style={{ marginTop: '0.2em' }} >
                                {index === 0 && (
                                    <React.Fragment key={index}>
                                        <Grid item xs={5}>
                                            <TextField
                                                fullWidth
                                                label={`Medicine ${index + 1} Name`}
                                                value={input.medName}
                                                onChange={(e) => handleInputChange(index, 'medName', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={3.5}>
                                            <TextField
                                                fullWidth
                                                label={`Dosage`}
                                                value={input.dailyDosage}
                                                type='number'
                                                onChange={(e) => handleInputChange(index, 'dailyDosage', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={3.5}>
                                            <TextField
                                                fullWidth
                                                label={`Quantity`}
                                                value={input.quantity}
                                                type='number'
                                                onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                            />
                                        </Grid>
                                    </React.Fragment>
                                )}
                                {index !== 0 && (
                                    <React.Fragment key={index}>
                                        <React.Fragment key={"sub" + index}>
                                            <Grid item xs={5}>
                                                <TextField
                                                    fullWidth
                                                    label={`Medicine ${index + 1} Name`}
                                                    value={input.medName}
                                                    onChange={(e) => handleInputChange(index, 'medName', e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    fullWidth
                                                    label={`Dosage`}
                                                    value={input.dailyDosage}
                                                    type='number'
                                                    onChange={(e) => handleInputChange(index, 'dailyDosage', e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    fullWidth
                                                    label={`Quantity`}
                                                    value={input.quantity}
                                                    type='number'
                                                    onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                                />
                                            </Grid>
                                        </React.Fragment>
                                        <Grid item xs={1}>
                                            <RemoveIcon onClick={() => handleRemoveInput(index)} sx={{ borderRadius: '0.2em',
                                            border: '1px solid red', color: 'red', height: '2.25em', cursor: 'pointer', transition: 'background-color 0.1s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: 'red', // Change the text color on hover
                                                color: 'white',
                                              }, }}></RemoveIcon>
                                        </Grid>
                                    </React.Fragment>
                                )}
                                {index === inputs.length - 1 && (
                                    <Grid item xs={12} sx={{ display: 'flex' }}>
                                        <SubdirectoryArrowRightIcon sx={{ alignItems: 'flex-start' }}></SubdirectoryArrowRightIcon>
                                        <Button type="button" elevation={5} onClick={handleAddInput} sx={{ width: '100%', backgroundColor: '#e0e0e0', height: '2em', marginBottom: '1em' }} >
                                            
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
                        ))}
                        </Container>


                    </Container>

                </CardContent>
                <CardActions sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Button type="submit" variant="contained" fullWidth sx={{ p: 1.8, marginTop: '2em', fontWeight: 'bold', width: '85%' }}>
                        Create Prescription
                    </Button>
                </CardActions>
            </Card>
                        </form>

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

        </Grid>
        
    );
}

export default AddPrescription;
