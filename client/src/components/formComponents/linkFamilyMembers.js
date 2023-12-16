import axios from "axios";
import sha256 from "js-sha256";
import { useForm } from "react-hook-form";
import {
  Box,
  Grid,
  Typography,
  FormControl,
  Button,
  Container,
  Paper,
  TextField,
  Snackbar, 
  Alert
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../userContest";

const LinkFamilyMember = () => {
   const { userId } = useUser();
  let id = userId;
  const [errorMessage, setErrorMessage] = useState(false);
  const [err, setErr] = useState("false");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    axios.post(`http://localhost:8000/patients/${userId}/linkfamilyMember`, data)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        const message = error.response?.data?.message || "An unknown error occurred";
        setSnackbarMessage(message);
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };



  return (
    <>
      <Container maxWidth="lg">
 
        <Paper elevation={3} sx={{ p: "20px", my: "40px" }}>
          <Typography variant="h6" sx={{ mb: 4 }}>
            {" "}
            Link A Patient As A Family Member{" "}
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  id="email"
                  label="email"
                  {...register("email", { required: true, maxLength: 80 })}
                  error={!!errors["email"]}
                  helperText={errors["email"]?.message}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id="mobileNumber"
                  label="Mobile Number"
                  {...register("mobileNumber", {
                    required: true,
                    maxLength: 80,
                  })}
                  error={!!errors["mobileNumber"]}
                  helperText={errors["mobileNumber"]?.message}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="relation">Relation</InputLabel>
                  <Select
                    {...register("relation", { required: true, maxLength: 80 })}
                    error={!!errors["relation"]}
                    helperText={errors["relation"]?.message}
                    type="number"
                    fullWidth
                    required
                    sx={{ textAlign: "left" }}
                    labelId="relation-label"
                    id="relation-select"
                    label="Relation"
                  >
                    <MenuItem value="husband">Husband</MenuItem>
                    <MenuItem value="wife">Wife</MenuItem>
                    <MenuItem value="child">Child</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
              <Button
                  type="submit"
                  variant="contained" // Changed to 'contained' for solid background
                  color="primary" // Sets the button color to primary theme color
                  fullWidth
                  sx={{
                    p: 1.8,
                    fontWeight: "bold",
                    color: "white", // Sets text color to white
                    
                  }}
                >
                  Link Member
                </Button>
              </Grid>
              
            </Grid>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LinkFamilyMember;
