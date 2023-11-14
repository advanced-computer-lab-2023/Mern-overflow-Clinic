import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  Button,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../../userContest";

const AddHealthRecord = () => {
  const {
    register,
    handleSubmit,
    reset, // <-- Add the reset function
    formState: { errors },
  } = useForm();
  const [date, setDate] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const { userId } = useUser();
  let id = userId;

  useEffect(() => {
    // Fetch the list of registered patients
    axios
      .get(`http://localhost:8000/doctors/${id}/registeredPatients`)
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error("Error fetching registered patients", error);
      });
  }, [id]);

  const onSubmit = (data) => {
    const selectedPatientObject = patients.find(
      (patient) => patient.name === selectedPatient
    );

    if (!selectedPatientObject) {
      console.error("Selected patient not found");
      return;
    }

    const requestData = {
      email: selectedPatientObject.email,
      diagnosis: data.diagnosis,
      date: date,
    };

    axios
      .post(`http://localhost:8000/doctors/${id}/addHealthRecord`, requestData)
      .then((response) => {
        setStatusMessage("Health record added successfully");
        console.log("POST request successful", response);

        // Reset the form after successful submission
        reset();

        // Optionally, you can handle other actions after resetting the form
      })
      .catch((error) => {
        setStatusMessage("Error adding health record");
        console.error("Error making POST request", error);
      });
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: "20px", my: "40px" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add Health Record
        </Typography>
        {statusMessage && (
          <Typography
            variant="body2"
            color={statusMessage.includes("Error") ? "error" : "success"}
            sx={{ mb: 2 }}
          >
            {statusMessage}
          </Typography>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel htmlFor="patient-select">Select Patient</InputLabel>
            <Select
              labelId="patient-select-label"
              id="patient-select"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              label="Patient"
            >
              {patients.map((patient) => (
                <MenuItem key={patient.name} value={patient.name}>
                  {patient.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Diagnosis"
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
