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
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const LinkFamilyMember = () => {
  const [errorMessage, setErrorMessage] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const id = "6529347d1b1e1b92fd454eff";
    axios
      .post(`http://localhost:8000/patients/${id}/linkfamilyMember`, data) // Send the data object with the request
      .then((response) => {
        console.log("POST request successful", response);
        setErrorMessage(false);
        window.location.reload();

      })
      .catch((error) => {
        console.error("Error making POST request", error);
        setErrorMessage(true);
      });
  };
  

  const handleChange = (event) => {
    if (errors[event.target.name]) {
      setError(event.target.name, {
        type: errors[event.target.name]["type"],
        message: errors[event.target.name]["type"],
      });
    }
  };

  return (
    <>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: "20px", my: "40px" }}>
          <Typography variant="h6" sx={{ mb: 4 }}>
            {" "}
            Add a New Family Member{" "}
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
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
                  {...register("mobileNumber", { required: true, maxLength: 80 })}
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
                  variant="outlined"
                  fullWidth
                  sx={{ p: 1.8, fontWeight: "bold" }}
                >
                  Link Member
                </Button>
              </Grid>
              {(errorMessage &&
             <Typography color="red">Patient Linked as a Family Member should be registered as patient with correct Mobile Number</Typography>
              )}
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default LinkFamilyMember;

