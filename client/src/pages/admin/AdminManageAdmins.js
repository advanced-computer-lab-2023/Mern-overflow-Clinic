import AdminDashboard from "./AdminDashboard";
import { Box, Typography, Button, Container, Paper, TextField } from "@mui/material";
import axios from 'axios';
import sha256 from 'js-sha256';
import { Controller, useForm } from "react-hook-form"

const AdminManageAdmins = () => {
    const { register, handleSubmit, setError, formState: { errors }, control } = useForm();

    const onAdd = data => {
        axios.post('http://localhost:8000/patients', {})
          .then((response) => {
            // Handle the successful response here
            console.log('POST request successful', response);
          })
          .catch((error) => {
            // Handle any errors here
            console.error('Error making POST request', error);
          });

      }

      const onDelete = data => {
        axios.post('http://localhost:8000/patients', {})
          .then((response) => {
            // Handle the successful response here
            console.log('POST request successful', response);
          })
          .catch((error) => {
            // Handle any errors here
            console.error('Error making POST request', error);
          });
      }

      const handleChange = (event) => {
        if (errors[event.target.name]) {
          setError(event.target.name,
            {
              type: errors[event.target.name]["type"],
              message: errors[event.target.name]["type"]
            })
        }
      }


    return (
        <>

            <AdminDashboard title="Manage System Admins" />

            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                    <Typography variant="h6" sx={{ mb: 4 }}> Add a New Admin to the System </Typography>
                    <Box component="form" sx={{ display: 'flex', alignItems: 'center' }} onSubmit={handleSubmit(onAdd)}>
                        <TextField sx={{ mr: "2%" }} label="Username" fullWidth />
                        <TextField sx={{ mr: "2%" }} label="Password" type="password" fullWidth />
                        <Button type="submit" variant="outlined" fullWidth sx={{ p: 1.8, fontWeight: 'bold' }}>
                            Add Admin
                        </Button>
                    </Box>
                </Paper>
            </Container>




            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                    <Typography variant="h6" sx={{ mb: 4 }}> Remove an Admin from the System </Typography>
                    <Box component="form" sx={{ display: 'flex', alignItems: 'center' }} onSubmit={handleSubmit(onDelete)}>
                        <TextField sx={{ mr: "2%" }} label="Username" fullWidth />
                        <Button type="submit" variant="outlined" fullWidth sx={{ p: 1.8, fontWeight: 'bold' }}>
                            Remove Admin
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}

export default AdminManageAdmins;