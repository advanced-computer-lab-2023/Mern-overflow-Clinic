import {
  Container,
  Paper,
  FormControl,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar, 
  Alert
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Typography } from "@mui/material";
import { useUser } from "../../userContest";
import dayjs from "dayjs";

export default function DoctorAddSlots() {
  const [date, setDate] = useState(null);
  const [message, setMessage] = useState("");
  const [slots, setSlots] = useState([]);
  const { userId } = useUser();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // Can be "error", "warning", "info", "success"

  let id = userId;

  const fetchSlots = () => {
    axios
      .get(`http://localhost:8000/doctors/${id}/slots`)
      .then((res) => {
        if (res.status === 200) {
          const slotsData = Array.isArray(res.data) ? res.data : [];
          setSlots(slotsData);
        } else {
          console.error("Failed to fetch slots. Unexpected response:", res);
        }
      })
      .catch((error) => {
        console.error("Error fetching slots:", error);
      });
  };

  useEffect(() => {
    fetchSlots();
  }, [date]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!date) {
      setSnackbarMessage("Please select a date.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
  
    axios
      .put(`http://localhost:8000/doctors/${id}/addSlots`, { date: date })
      .then((res) => {
        const responseMessage = res.data.message || "Slot added successfully.";
        setSnackbarMessage(responseMessage);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setDate(null);
        fetchSlots(); // Refresh slots
        // Optional: window.location.reload();
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "Error adding slot.";
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        console.error("Error adding slot:", error);
      });
  };
  
  

  const handleRefresh = () => {
    fetchSlots();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: "20px", my: "40px" }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add a free slot start time
            </Typography>
            <FormControl fullWidth>
            <DateTimePicker
                views={['year', 'month', 'day', 'hours']}
                value={date}
                onChange={setDate}
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mb: 3, p: 1.8, fontWeight: "bold", marginTop: 2 }}
            >
              Add Slot
            </Button>
          </form>
          <Snackbar
      open={openSnackbar}
      autoHideDuration={6000}
      onClose={() => setOpenSnackbar(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Positioning the Snackbar at the top center

    >
      <Alert 
        onClose={() => setOpenSnackbar(false)} 
        severity={snackbarSeverity} 
        sx={{ width: '100%' }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
          <Button
            variant="contained"
            fullWidth
            onClick={handleRefresh}
            sx={{ mb: 3, p: 1.8, fontWeight: "bold", marginTop: 2 }}
          >
            Refresh Slots
          </Button>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date and Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slots.map((slot, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {dayjs(slot).format("MMMM D, YYYY h:mm A")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {message && <div>{message}</div>}
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}
