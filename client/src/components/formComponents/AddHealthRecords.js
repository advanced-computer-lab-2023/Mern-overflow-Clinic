import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";

const AddHealthRecord = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [date, setDate] = useState(null);
  const id = "65293c2cb5a34d208108cc33"; // Doctor ID

  const onSubmit = (data) => {
    const requestData = {
      email: data.email,
      diagnosis: data.diagnosis,
      date: date,
    };

    axios
      .post(`http://localhost:8000/doctors/${id}/addHealthRecord`, requestData)
      .then((response) => {
        console.log("POST request successful", response);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error making POST request", error);
      });
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: "20px", my: "40px" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add Health Record
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="patient email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            })}
            fullWidth
            sx={{ mb: 2 }}
          />
          {errors.email && (
            <Typography color="error">{errors.email.message}</Typography>
          )}
          <TextField
            label="diagnosis"
            {...register("diagnosis", { required: "Diagnosis is required" })}
            fullWidth
            sx={{ mb: 2 }}
          />
          {errors.diagnosis && (
            <Typography color="error">{errors.diagnosis.message}</Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ p: 1.8, fontWeight: "bold", mb: 2 }}
          >
            Add Health Record
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddHealthRecord;
