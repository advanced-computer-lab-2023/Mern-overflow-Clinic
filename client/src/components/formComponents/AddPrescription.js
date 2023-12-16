import { Box, Typography, Grid, FormControl, Button, Container, Paper, TextField, Select, MenuItem } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment'; import axios from 'axios';
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { useUser } from "../../userContest";
import React from "react";

const AddPrescription = () => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [patients, setPatients] = useState([]);
    const [inputs, setInputs] = useState([{ medName: '', dailyDosage: '', quantity: '' }]); // State to keep track of input values
    const [selectedPatient, setselectedPatient] = useState();
    const { userId } = useUser();
    // const id = "655089b786a7e9fff5d1d36a";
    const id = userId;
    
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
        console.log("Patient ID: "+patientId);
        const medicines = [];
        for (const input of inputs) {
            console.log("Input: "+JSON.stringify(input));
            if (input.medName === '' || input.dailyDosage === '' || input.quantity === '') {
                continue;
            }
            medicines.push({ medName: input.medName, dailyDosage: input.dailyDosage, quantity: input.quantity });
        }
        console.log("Medicines: "+JSON.stringify(medicines));


        // console.log("DATA:  Packs: "+JSON.stringify(dataToServer));
        axios.post(`http://localhost:8000/prescriptions/doctors/${id}/patients/${patientId}/addPrescription`, {medicines: medicines})
            .then((response) => {
                console.log('POST request successful', response);
            })
            .catch((error) => {
                console.error('Error making POST request', error);
            });
        window.location.reload();
    }


    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                <Typography variant="h6" sx={{ mb: 4 }}> Add a New Health Package to the System </Typography>
                <Box component="form" sx={{ display: 'flex', alignItems: 'center' }} onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2} sx={{alignItems: 'center'}}>
                        
                            <Grid container spacing={2} sx={{alignItems: 'center'}}>
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

                            {inputs.map((input, index) => (
                                
                                <Grid container spacing={2} key={index} style={{ marginTop: '0.2em' }} >
                                    { index === 0 && (
                                        <React.Fragment key={index}>
                                            <Grid item xs={6}>
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
                                                label={`Medicine ${index + 1} Daily Dosage`}
                                                value={input.dailyDosage}
                                                type='number'
                                                onChange={(e) => handleInputChange(index, 'dailyDosage', e.target.value)}
                                            />
                                            </Grid>
                                            <Grid item xs={3}>
                                            <TextField
                                                fullWidth
                                                label={`Medicine ${index + 1} Quantity`}
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
                                        <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label={`Medicine ${index + 1} Name`}
                                            value={input.medName}
                                            onChange={(e) => handleInputChange(index, 'medName', e.target.value)}
                                        />
                                        </Grid>
                                        <Grid item xs={2.5}>
                                        <TextField
                                            fullWidth
                                            label={`Medicine ${index + 1} Daily Dosage`}
                                            value={input.dailyDosage}
                                            type='number'
                                            onChange={(e) => handleInputChange(index, 'dailyDosage', e.target.value)}
                                        />
                                        </Grid>
                                        <Grid item xs={2.5}>
                                        <TextField
                                            fullWidth
                                            label={`Medicine ${index + 1} Quantity`}
                                            value={input.quantity}
                                            type='number'
                                            onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                        />
                                        </Grid>
                                    </React.Fragment>
                                    <Grid item xs={1}>
                                    <button type="button" onClick={() => handleRemoveInput(index)}>
                                        Remove
                                    </button>
                                    </Grid>
                                </React.Fragment>
                                )}
                                {index === inputs.length - 1 && (
                                    <Grid item xs={12}>
                                    <button type="button" onClick={handleAddInput}>
                                        Add
                                    </button>
                                    </Grid>
                                )}
                                </Grid>
                            ))}

                        <Grid item xs={12} sm={4}>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button type="submit" variant="outlined" fullWidth sx={{ p: 1.8, fontWeight: 'bold' }}>
                                Create Prescription
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

export default AddPrescription;
