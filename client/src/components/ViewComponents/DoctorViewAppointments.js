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
  DialogContentText,
  DialogTitle,
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
import { useNavigate } from 'react-router-dom';

// Importing Material-UI Components
import IconButton from '@mui/material/IconButton';
import PaymentIcon from '@mui/icons-material/Payment';



export default function DoctorViewAppointments() {
  const [data, setData] = useState([]);
  const { userId } = useUser();
  const [cancelAppointmentId, setCancelAppointmentId] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const navigate = useNavigate();

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
  const handleCancelDialogOpen = (appointmentId) => {
    setCancelAppointmentId(appointmentId);
    setOpenCancelDialog(true);
  };

  const handleCancelDialogClose = () => {
    setOpenCancelDialog(false);
  };
  const handleRescheduleClick = (appointmentId) => {
    // Navigate to the reschedule page with the doctor's ID and the appointment ID
    navigate(`/doctor/reschedualAppointments/${id}/${appointmentId}`);
  };
  const handleCancelConfirmation = () => {
    // Trigger the cancellation method with the selected appointment ID
    axios
      .put(`http://localhost:8000/doctors/${id}/cancelAppointment`, {
        apt: cancelAppointmentId,
      })
      .then((res) => {
        console.log(res.data);
        // You can handle the response if needed
        // Refresh the table data after cancellation
        fetchTableData();
      })
      .catch((error) => {
        console.error("Error canceling appointment:", error);
      })
      .finally(() => {
        // Close the cancel dialog
        setOpenCancelDialog(false);
        // Reset the cancel appointment ID
        setCancelAppointmentId(null);
      });
  };

  return (
    <Container maxWidth="xl">
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
            <TableCell key="patient">Patient</TableCell>
            <TableCell key="duration">Duration</TableCell>
            <TableCell key="date">Date</TableCell>
            <TableCell key="status">Status</TableCell>
            <TableCell key="state">State</TableCell> 
            <TableCell key="actions">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map((row) => (
              <TableRow
                key={
                  row.date +
                  (row.patient?.name || "") +
                  row.status +
                  Math.random()
                }
              >
                <TableCell>{row.patient?.name || "N/A"}</TableCell>
                <TableCell>{row.duration + " hour"}</TableCell>
                <TableCell>{dayjs(row.date).format("MMMM D, YYYY h:mm A")}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{calculateState(row.date)}</TableCell>
                <TableCell>
                <Link >
                    <Button
                      variant="contained"
                      size="small" 
                       
                      disabled={!(row.status === "upcoming")}
                      onClick={() => handleRescheduleClick(row._id)}
                    >
                      Reschedule                    
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  disabled={!(row.status === "upcoming")}
                  onClick={() => handleCancelDialogOpen(row._id)}
                >
                  Cancel
                </Button>
              </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Dialog
        open={openCancelDialog}
        onClose={handleCancelDialogClose}
        aria-labelledby="cancel-appointment-dialog-title"
        aria-describedby="cancel-appointment-dialog-description"
      >
        <DialogTitle id="cancel-appointment-dialog-title">
          Confirm Appointment Cancellation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-appointment-dialog-description">
            Are you sure you want to cancel this appointment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose}>Cancel</Button>
          <Button onClick={handleCancelConfirmation} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}