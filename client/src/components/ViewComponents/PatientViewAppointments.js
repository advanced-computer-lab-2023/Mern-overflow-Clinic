import {
  Container,
  Button,
  Paper,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Snackbar,
  Alert
} from "@mui/material";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import dayjs from "dayjs"; // Import dayjs for date manipulation
import { useUser } from "../../userContest";
// Importing React Router Link
import { Link } from 'react-router-dom';
import ReschedulePopup from "../formComponents/RescheduleAppointments";

// Importing Material-UI Components
import IconButton from '@mui/material/IconButton';
import PaymentIcon from '@mui/icons-material/Payment';



export default function PatientViewAppointments() {
  const [data, setData] = useState([]);
  const { userId } = useUser();
  const [reschedulePopupOpen, setReschedulePopupOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  
  const id = userId;
  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/appointments/all/${id}`, {})
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error getting Appointment data", error);
      });
  };

  useEffect(() => {
    // Fetch data on page load
    fetchTableData();

    // Call "appointments/refresh" on page load
    axios
      .put(`http://localhost:8000/appointments/refresh`)
      .then((res) => {
        console.log(res.data);
        // You can handle the response if needed
      })
      .catch((error) => {
        console.error("Error refreshing appointments", error);
      });

    // Fetch data on page refresh
    const handleRefresh = () => {
      fetchTableData();

      // Call "appointments/refresh" on page refresh
      axios
        .put(`http://localhost:8000/appointments/refresh`)
        .then((res) => {
          console.log(res.data);
          // You can handle the response if needed
        })
        .catch((error) => {
          console.error("Error refreshing appointments", error);
        });
    };

    window.addEventListener('beforeunload', handleRefresh);

    return () => {
      window.removeEventListener('beforeunload', handleRefresh);
    };
  }, []); 

  const calculateState = (appointmentDate) => {
    const currentDate = dayjs();
    const formattedAppointmentDate = dayjs(appointmentDate);

    return formattedAppointmentDate.isAfter(currentDate) ? "upcoming" : "past";
  };

  const handleFilter = (e) => {
    e.preventDefault();
    let status = e.target[0].value;
    let date = e.target[2].value;

    if (date === "") {
      axios
        .post(`http://localhost:8000/appointments/filter/${id}`, {
          status: status,
        })
        .then((res) => {
          console.log(res.data);
          setData(res.data);
        })
        .catch(() => setData([]));
    } else {
      axios
        .post(`http://localhost:8000/appointments/filter/${id}`, {
          status: status,
          date: date,
        })
        .then((res) => {
          setData(res.data);
        })
        .catch(() => setData([]));
    }
  };


  const handleRescheduleClick = (appointmentID,doctorID) => {
    console.clear();  // Clear the console

    const appointment = data.find(app => app._id === appointmentID);
    console.log(appointmentID);
    if (appointment) {
      setSelectedAppointmentId(appointmentID);
      setSelectedDoctorId(doctorID); // Assuming 'doctor' is the field in the appointment
      setReschedulePopupOpen(true);
    } else {
      console.error('Appointment not found');
    }
  };
  
  
  
  const handleCancelClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setOpenConfirmationDialog(true); // Open confirmation dialog
  };

  const handleCancelConfirmation = () => {
    axios.put(`http://localhost:8000/appointments/cancel/${selectedAppointmentId}`)
      .then((res) => {
        setSnackbarMessage('Appointment cancelled successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchTableData(); // Refresh the data
      })
      .catch((error) => {
        setSnackbarMessage('Error canceling appointment.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      })
      .finally(() => {
        setOpenConfirmationDialog(false); // Close the dialog
      });
  };
  


  
  return (
    <Container maxWidth="xl">

      
    <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} 

        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
    </Snackbar>
      <Dialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Cancellation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel this appointment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmationDialog(false)} color="primary">
            No
          </Button>
          <Button onClick={handleCancelConfirmation} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
     
     <ReschedulePopup
      open={reschedulePopupOpen}
      onClose={() => setReschedulePopupOpen(false)}
      appointmentId={selectedAppointmentId}
      doctorId={selectedDoctorId} 
    />




      <Paper elevation={3} sx={{ p: 2, my: 2, paddingBottom: 2 }}>
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 2,
          }}
        >
          <Container sx={{ width: "48%" }}>
            <form onSubmit={handleFilter}>
              <FormControl fullWidth>
                <InputLabel id="filter-by-upcoming"></InputLabel>
                <Select
                  labelId="filter-by-upcoming"
                  id="filter-by-upcoming"
                  label="upcoming"
                  defaultValue="upcoming"
                  uncontrolled="true"
                  fullWidth
                >
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="rescheduled">Rescheduled</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    slotProps={{
                      actionBar: {
                        actions: ["accept", "clear"],
                      },
                    }}
                  ></DateTimePicker>
                </LocalizationProvider>
              </FormControl>

              <FormControl fullWidth>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mt: 1, mb: 1, p: 1, fontWeight: "bold" }}
                >
                  Filter
                </Button>
              </FormControl>
            </form>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              onClick={fetchTableData}
              sx={{ mt: 1, mb: 1, p: 1, fontWeight: "bold" }}
            >
              Clear
            </Button>
          </Container>
        </Container>
      </Paper>
      <Button
        fullWidth
        variant="contained"
        onClick={fetchTableData}
        sx={{ mt: 3, mb: 2, p: 2, fontWeight: "bold" }}
      >
        View All
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell key="doctor">Doctor</TableCell>
            <TableCell key="duration">Duration</TableCell>
            <TableCell key="date">Date</TableCell>
            <TableCell key="date">Type</TableCell>
            <TableCell key="status">Status</TableCell>
            <TableCell key="state">State</TableCell> {/* New column */}
          </TableRow>
        </TableHead>
        <TableBody>
  {data &&
    data.map((row) => (
      <TableRow
        key={row.date + (row.doctor?.name || "") + row.status + Math.random()}
      >
        <TableCell>{row.doctor?.name || "N/A"}</TableCell>
        <TableCell>{row.duration + " hour"}</TableCell>
        <TableCell>{dayjs(row.date).format("MMMM D, YYYY h:mm A")}</TableCell>
        <TableCell>{row.appointmentType}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>{calculateState(row.date)}</TableCell>
        <TableCell>
        <Button
            variant="contained"
            color="warning"
            size="small"
            disabled={row.status !== "upcoming" || row.appointmentType !== "regular"}
            onClick={() => handleRescheduleClick(row._id, row.doctor._id)}
            sx={{
              opacity: row.status === "upcoming" && row.appointmentType === "regular" ? 1 : 0.5,
              backgroundColor: row.status === "upcoming" && row.appointmentType === "regular" ? undefined : '#F1974E',
              color: 'white',
              textTransform: 'none', // Changes text to normal casing
              '&.Mui-disabled': {
                color: 'white',
                backgroundColor: '#F1974E',
                opacity: 0.5
              }
            }}
          >
            Reschedule
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="error"
            size="small"
            disabled={row.status !== "upcoming" || row.appointmentType !== "regular"}
            onClick={() => handleCancelClick(row._id)}
            sx={{
              opacity: row.status === "upcoming" && row.appointmentType === "regular" ? 1 : 0.5,
              backgroundColor: row.status === "upcoming" && row.appointmentType === "regular" ? undefined : '#f44336',
              color: 'white',
              textTransform: 'none', // Changes text to normal casing
              '&.Mui-disabled': {
                color: 'white',
                backgroundColor: '#f44336',
                opacity: 0.5
              }
            }}
          >
            Cancel
          </Button>
        </TableCell>


      </TableRow>
    ))}
</TableBody>

      </Table>
    </Container>



  );

  
}