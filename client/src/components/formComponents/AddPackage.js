import { Box, Grid, Typography, Button, Container, Paper, TextField } from "@mui/material";
import axios from 'axios';
import sha256 from 'js-sha256';
import { useForm } from "react-hook-form"

const AddPackage = () => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm();

    const onSubmit = data => {
        const dataToServer = { ...data };
        axios.post('http://localhost:8000/packages', dataToServer)
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
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                <Typography variant="h6" sx={{ mb: 4 }}> Add a New Health Package to the System </Typography>
                <Box component="form" sx={{ display: 'flex', alignItems: 'center' }} onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField sx={{ mr: "2%" }} label="Name" fullWidth
                                {...register("name", { required: true, maxLength: 80 })}
                                error={!!errors["name"]}
                                helperText={errors["name"]?.message}
                                onBlur={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField sx={{ mr: "2%" }} label="Price" fullWidth type="number"
                                {...register("price", { required: true, maxLength: 80 })}
                                error={!!errors["price"]}
                                helperText={errors["price"]?.message}
                                onBlur={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField sx={{ mr: "2%" }} label="Discount on Doctor Sessions" fullWidth type="number"
                                inputProps={{ max: 100 }}
                                {...register("discountOnDoctorSessions", { required: true, maxLength: 80 })}
                                error={!!errors["discountOnDoctorSessions"]}
                                helperText={errors["discountOnDoctorSessions"]?.message}
                                onBlur={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField sx={{ mr: "2%" }} label="Discount on Medicine" fullWidth type="number"
                                inputProps={{ max: 100 }}
                                {...register("discountOnMedicine", { required: true, maxLength: 80 })}
                                error={!!errors["discountOnMedicine"]}
                                helperText={errors["discountOnMedicine"]?.message}
                                onBlur={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField sx={{ mr: "2%" }} label="Discount For Family" fullWidth type="number"
                                inputProps={{ max: 100 }}
                                {...register("discountForFamily", { required: true, maxLength: 80 })}
                                error={!!errors["discountForFamily"]}
                                helperText={errors["discountForFamily"]?.message}
                                onBlur={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button type="submit" variant="outlined" fullWidth sx={{ p: 1.8, fontWeight: 'bold' }}>
                                Add Health Package
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

export default AddPackage;