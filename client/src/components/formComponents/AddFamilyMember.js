import axios from 'axios';
import sha256 from 'js-sha256';
import { useForm } from "react-hook-form"
import { Box, Grid, Typography, FormControl, Button, Container, Paper, TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";

const AddAdmin = () => {
    let { id } = useParams();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [name, setName] = useState("");
    const [nationalId, setNationalId] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [relation, setRelation] = useState("");

    const onSubmit = data => {
        const dataToServer = { name, nationalId, age, gender, relation };
        axios.put(`http://localhost:8000/patients/${id}/relatives`, dataToServer)
            .then((response) => {
                console.log('PUT request successful', response);
            })
            .catch((error) => {
                console.error('Error making PUT request', error);
            });
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
                                    value={name}
                                    onChange={(e) => { setName(e.target.value) }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    id="nationalId"
                                    label="National ID"
                                    value={nationalId}
                                    onChange={(e) => { setNationalId(e.target.value) }}
                                    type="number"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    id="age"
                                    label="Age"
                                    value={age}
                                    onChange={(e) => { setAge(e.target.value) }}
                                    type="number"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="gender-label">Gender</InputLabel>
                                    <Select
                                        value={nationalId}
                                        onChange={(e) => { setNationalId(e.target.value) }}
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
                                <TextField label="Relation" fullWidth />
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

export default AddAdmin;