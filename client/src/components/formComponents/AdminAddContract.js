import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Paper, TextField, Select, MenuItem, Snackbar, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useForm } from "react-hook-form";

const AdminAddContract = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const [doctors, setDoctors] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  useEffect(() => {
    axios.get('/doctors/')
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('Error fetching doctors', error);
      });

    axios.get('/contracts/')
      .then(response => {
        setContracts(response.data);
      })
      .catch(error => {
        console.error('Error fetching contracts', error);
      });
  }, []);

  const onSubmit = data => {
    // Assuming the user's ID is stored in localStorage or a similar place
    const userId = localStorage.getItem('userId');
    axios.post(`admins/${userId}/createContract`, data)
      .then(response => {
        setSnackbarMessage('Contract created successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      })
      .catch(error => {
        setSnackbarMessage('Failed to create contract.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
        <Typography variant="h6" sx={{ mb: 4 }}>Create Contract</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Clinic Markup"
            type="number"
            {...register("clinicMarkup", { required: true })}
            error={!!errors["clinicMarkup"]}
            helperText={errors["clinicMarkup"]?.message}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Select
            label="Doctor"
            {...register("doctorUsername", { required: true })}
            error={!!errors["doctorUsername"]}
            fullWidth
            sx={{ mb: 2 }}
          >
            {doctors.map(doctor => (
              <MenuItem key={doctor.username} value={doctor.username}>{doctor.username}</MenuItem>
            ))}
          </Select>
          <Button type="submit" variant="contained" fullWidth>
            Create Contract
          </Button>
        </Box>

        {contracts.map(contract => (
          <Card key={contract.id} sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6">{contract.doctor.name}</Typography>
              <Typography>Date: {contract.date}</Typography>
              <Typography>Clinic Markup: {contract.clinicMarkup}</Typography>
              <Typography>Status: {contract.status}</Typography>
            </CardContent>
          </Card>
        ))}
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Container>
  );
}

export default AdminAddContract;
