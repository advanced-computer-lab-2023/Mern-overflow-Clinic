import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../userContest";
import {
  Container,
  Paper,
  Typography,
  FormControl,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  InputAdornment,
  Snackbar,
  Alert,
  Card,
  CardContent,
} from "@mui/material";

const FollowUpPage = ({ match }) => {
  const { userId } = useUser();
  let id = userId;
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [date, setDate] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [pendingFollowUps, setPendingFollowUps] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [patientUsernames, setPatientUsernames] = useState({}); // Store patient usernames

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/doctors/${id}/completedAppointments`
        );
        const emailList = response.data.map(
          (appointment) => appointment.email
        );
        setEmails(emailList);
        setSelectedEmail(""); // Set the default value to an empty string
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    fetchEmails();
  }, [id]);

  const fetchPendingFollowUps = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/appointments/pendingFollowUps/${id}`
      );
      setPendingFollowUps(response.data || []);
    } catch (error) {
      setErrorMessage("Error fetching pending follow-ups");
      console.error("Error fetching pending follow-ups:", error);
    }
  };

  useEffect(() => {
    fetchPendingFollowUps();
  }, [id]);

  useEffect(() => {
    // Fetch patient usernames and store them in the state
    const fetchPatientUsernames = async () => {
      const usernameMap = {};
      for (const followUp of pendingFollowUps) {
        try {
          const response = await axios.get(
            `http://localhost:8000/patients/${followUp.patient}`
          );
          const patientUsername = response.data.username;
          usernameMap[followUp.patient] = patientUsername;
        } catch (error) {
          console.error("Error fetching patient username:", error);
        }
      }
      setPatientUsernames(usernameMap);
    };

    fetchPatientUsernames();
  }, [pendingFollowUps]);

  const handleAcceptReject = async (followUpId, action) => {
    try {
      // Call the API endpoint based on the action (accept or reject)
      await axios.put(`http://localhost:8000/doctors/${id}/${action}FollowUp`, {
        appointmentId: followUpId,
      });

      // Fetch updated data after accepting or rejecting the follow-up
      fetchPendingFollowUps();
    
      // Show success message
      setStatusMessage(`${action}ed follow-up successfully`);
      setIsSuccess(true);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      // Handle errors if needed
      console.error(`Error ${action.toLowerCase()}ing follow-up:`, error);
      setStatusMessage(`Error ${action.toLowerCase()}ing follow-up. Please try again.`);
      setIsSuccess(false);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const formatDate = (date) => {
    // Format your date as needed
    return new Date(date).toLocaleDateString();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Validate if the selected date is in the future
    const selectedDate = new Date(date);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      setStatusMessage("Please select a future date for the session.");
      setIsSuccess(false);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Validate if an email is selected
    if (!selectedEmail) {
      setStatusMessage("Please choose a patient email.");
      setIsSuccess(false);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Clear the status message
    setStatusMessage("");

    const dataToServer = { email: selectedEmail, date };
    axios
      .post(
        `http://localhost:8000/doctors/${id}/createFollowup`,
        dataToServer
      )
      .then((response) => {
        console.log("POST request successful", response);
        setStatusMessage("Follow-up scheduled successfully");
        setIsSuccess(true);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        // Clear the input fields
        setDate("");
        setSelectedEmail(""); // Reset email to the default value
      })
      .catch((error) => {
        console.error("Error making POST request", error);
        setStatusMessage("Error scheduling follow-up. Please try again.");
        setIsSuccess(false);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: "20px", my: "40px" }}>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Schedule A Follow Up With A Patient
        </Typography>
        <form onSubmit={onSubmit}>
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
          <TextField
            sx={{ mb: 3 }}
            value={date}
            type="datetime-local"
            onChange={(e) => setDate(e.target.value)}
            required
            fullWidth
          />
          {statusMessage && (
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity={snackbarSeverity}
                sx={{ width: "100%" }}
              >
                {statusMessage}
              </Alert>
            </Snackbar>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mb: 3, p: 1.8, fontWeight: "bold" }}
          >
            Schedule Follow Up
          </Button>
        </form>
      </Paper>
      <Paper elevation={3} sx={{ p: "20px", my: "40px" }}>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Pending Follow-ups
        </Typography>
        {errorMessage && (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {errorMessage}
            </Alert>
          </Snackbar>
        )}
       {pendingFollowUps.map((followUp, index) => (
  <Card key={followUp._id} sx={{ mb: 2 }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="body1" sx={{ flex: 1 }}>
        Patient {patientUsernames[followUp.patient]} requested a follow-up on {formatDate(followUp.date)}.
      </Typography>
      <div>
        <Button
          onClick={() => handleAcceptReject(followUp._id, "Accept")}
          variant="outlined"
          sx={{ color: 'blue', marginRight: 2 }}
        >
          Accept
        </Button>
        <Button
          onClick={() => handleAcceptReject(followUp._id, "Reject")}
          variant="outlined"
          sx={{ color: 'red' }}
        >
          Reject
        </Button>
      </div>
    </CardContent>
  </Card>
))}

      </Paper>
    </Container>
  );
};

export default FollowUpPage;
