import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  FormControl,
  Button,
  Container,
  Paper,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { useUser } from "../../userContest";

const ScheduleFollowUp = () => {
  const { userId } = useUser();
  let id = userId;

  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/doctors/${id}/completedAppointments`
        );
        const emailList = response.data.map((appointment) => appointment.email);
        setEmails(emailList);
        setSelectedEmail(""); // Set the default value to an empty string
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    fetchEmails();
  }, [id]);

  const onSubmit = (e) => {
    e.preventDefault();

    // Validate if the selected date is in the future
    const selectedDate = new Date(date);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      setStatusMessage("Please select a future date for the session.");
      setIsSuccess(false);
      return;
    }

    // Validate if an email is selected
    if (!selectedEmail) {
      setStatusMessage("Please choose a patient email.");
      setIsSuccess(false);
      return;
    }

    // Clear the status message
    setStatusMessage("");

    const dataToServer = { email: selectedEmail, price, date };
    axios
      .post(`http://localhost:8000/doctors/${id}/createFollowup`, dataToServer)
      .then((response) => {
        console.log("POST request successful", response);
        setStatusMessage("Follow-up scheduled successfully");
        setIsSuccess(true);
        // Clear the input fields
        setPrice("");
        setDate("");
        setSelectedEmail(""); // Reset email to the default value
      })
      .catch((error) => {
        console.error("Error making POST request", error);
        setStatusMessage("Error scheduling follow-up. Please try again.");
        setIsSuccess(false);
      });
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: "20px", my: "40px" }}>
        <Typography variant="h6" sx={{ mb: 4 }}>
          {" "}
          Schedule A Follow Up With A Patient{" "}
        </Typography>
        <Box component="form" onSubmit={onSubmit}>
          <FormControl sx={{ mb: 3 }} fullWidth>
            <InputLabel htmlFor="patient-email-select">Patient Email</InputLabel>
            <Select
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              label="Patient Email"
              inputProps={{
                name: "patient-email",
                id: "patient-email-select",
              }}
            >
              <MenuItem value="" disabled>
                Choose Email
              </MenuItem>
              {emails.map((email) => (
                <MenuItem key={email} value={email}>
                  {email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ mb: 3 }} fullWidth>
            <InputLabel htmlFor="outlined-adornment-amount"></InputLabel>
            <TextField
              value={price}
              autoComplete="off"
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              required
              inputProps={{ max: 10000, min: 10 }}
              type="number"
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">EGP</InputAdornment>
              }
              label="Session Price"
            />
          </FormControl>
          <TextField
            sx={{ mb: 3 }}
            value={date}
            type="datetime-local"
            onChange={(e) => setDate(e.target.value)}
            // label="Select Date and Time"
            required
            fullWidth
          />
          {statusMessage && (
            <Typography
              sx={{
                border: "1px solid transparent",
                borderRadius: 5,
                padding: 2,
                color: isSuccess ? "green" : "red",
              }}
            >
              {statusMessage}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mb: 3, p: 1.8, fontWeight: "bold" }}
          >
            Schedule Follow Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ScheduleFollowUp;