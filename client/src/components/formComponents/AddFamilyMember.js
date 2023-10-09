import axios from 'axios';
import sha256 from 'js-sha256';
import { useForm } from "react-hook-form"
import { Box, Grid, Typography, FormControl, Button, Container, Paper, TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";

const AddFamilyMember = () => {
    let { id } = useParams();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();

    const onSubmit = data => {
        const dataToServer = { ...data };
        axios.post(`http://localhost:8000/patients/${id}/familyMember`, dataToServer)
            .then((response) => {
                console.log('PUT request successful', response);
            })
            .catch((error) => {
                console.error('Error making PUT request', error);
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
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                    <Typography variant="h6" sx={{ mb: 4 }}> Add a New Family Member </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    id="name"
                                    label="Name"
                                    {...register("name", { required: true, maxLength: 80 })}
                                    error={!!errors["name"]}
                                    helperText={errors["name"]?.message}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    id="nationalId"
                                    label="National ID"
                                    {...register("nationalId", { required: true, maxLength: 80 })}
                                    error={!!errors["nationalId"]}
                                    helperText={errors["nationalId"]?.message}
                                    type="number"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    id="age"
                                    label="Age"
                                    {...register("age", { required: true, maxLength: 80 })}
                                    error={!!errors["age"]}
                                    helperText={errors["age"]?.message}
                                    type="number"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="gender-label">Gender</InputLabel>
                                    <Select
                                        {...register("gender", { required: true, maxLength: 80 })}
                                        error={!!errors["gender"]}
                                        helperText={errors["gender"]?.message}
                                        type="number"
                                        fullWidth
                                        required
                                        sx={{ textAlign: 'left' }}
                                        labelId="gender-label"
                                        id="gender-select"
                                        label="Gender"
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    id="relation"
                                    label="Relation"
                                    {...register("relation", { required: true, maxLength: 80 })}
                                    error={!!errors["relation"]}
                                    helperText={errors["relation"]?.message}
                                    fullWidth
                                    required />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button type="submit" variant="outlined" fullWidth sx={{ p: 1.8, fontWeight: 'bold' }}>
                                    Add Member
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </>

    );
}

export default AddFamilyMember;