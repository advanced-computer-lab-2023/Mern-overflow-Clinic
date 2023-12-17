import React, { useState, useEffect } from 'react';
import { Alert,Box, Typography, Button, Container, Paper, TextField, Select, MenuItem, Snackbar, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useUser } from '../../userContest';

const AdminAddContract = () => {
const { userId } = useUser();

  const { register, handleSubmit, setError, formState: { errors }, setValue, watch } = useForm();
  const [doctors, setDoctors] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(`http://localhost:8000/doctors/`)
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('Error fetching doctors', error);
      });

    axios.get('http://localhost:8000/contracts/')
      .then(response => {
        setContracts(response.data);
      })
      .catch(error => {
        console.error('Error fetching contracts', error);
      });
  };

  const onSubmit = data => {
    axios.post(`http://localhost:8000/admins/${userId}/createContract`, data)
      .then(response => {
        
        setSnackbarMessage('Contract created successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchData();
      })
      .catch(error => {
        setSnackbarMessage('Failed to create contract.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        fetchData();
      });
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const selectedDoctorId = watch('doctorId'); // Get the selected doctor's ID from the form data

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
        <Typography variant="h6" sx={{ mb: 4 }}>Create Contract</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Clinic Markup"
            type="number"
            {...register('clinicMarkup', { required: true })}
            error={!!errors['clinicMarkup']}
            helperText={errors['clinicMarkup']?.message}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Select
            label="Doctor"
            {...register('doctorId', { required: true })}
            value={selectedDoctorId}
            onChange={(e) => setValue('doctorId', e.target.value)} // Set the doctorId directly in the form data
            error={!!errors['doctoIdr']}
            fullWidth
            sx={{ mb: 2 }}
          >
            {doctors.map(doctor => (
              <MenuItem key={doctor._id} value={doctor._id}>
                {doctor.username}
              </MenuItem>
            ))}
          </Select>

          <Button type="submit" variant="contained" fullWidth>
            Create Contract
          </Button>
        </Box>

        {contracts.map(contract => (
          <Card key={contract.id} sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6">{contract.doctorName}</Typography>
              <Typography>Date: {new Date(contract.date).toLocaleDateString()}</Typography>
              <Typography>Clinic Markup: {contract.clinicMarkup}</Typography>
              <Typography>Status: {contract.status}</Typography>
            </CardContent>
          </Card>
        ))}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminAddContract;
