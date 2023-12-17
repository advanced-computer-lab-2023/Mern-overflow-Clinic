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
  Alert,
  Card, CardContent, CardActions, Typography,
  Grid,TextField,
  Tooltip
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
  import { useParams } from 'react-router-dom';

  // Importing Material-UI Components
  import IconButton from '@mui/material/IconButton';
  import PaymentIcon from '@mui/icons-material/Payment';
  import ReschedulePopup from "../formComponents/RescheduleAppointments";

  
  
  export default function ViewAppointments() {
    const [data, setData] = useState([]);
    const { userId } = useUser();
    const [cancelAppointmentId, setCancelAppointmentId] = useState(null);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [reschedulePopupOpen, setReschedulePopupOpen] = useState(false);
    const [cancelPopupOpen, setCancelPopupOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const navigate = useNavigate();
  
    const params = useParams();
    const id = params.id;
  
    const fetchTableData = () => {
      axios
        .get(`http://localhost:8000/appointments/all/${id}`, {})
        .then((res) => {
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
        // API call to cancel the appointment
        axios.put(`http://localhost:8000/appointments/cancel/${selectedAppointmentId}`)
          .then((res) => {
            console.log('Appointment cancelled', res);
            fetchTableData(); // Refresh the data
          })
          .catch((error) => {
            console.error("Error canceling appointment:", error);
          })
          .finally(() => {
            setOpenConfirmationDialog(false); // Close the dialog
          });
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
      
      const refreshPage = () => {
        fetchTableData(); // This function will refresh the data
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
    
        <Grid container spacing={2}>
            {/* Left Half - Form */}
            <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, my: 2, minHeight: '650px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <form onSubmit={handleFilter} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="filter-by-upcoming-label">Appointment Status</InputLabel>
                        <Select
                            labelId="filter-by-upcoming-label"
                            id="filter-by-upcoming"
                            label="Appointment Status"
                            defaultValue="upcoming"
                        >
                            <MenuItem value="upcoming">Upcoming</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                            <MenuItem value="rescheduled">Rescheduled</MenuItem>
                        </Select>
                    </FormControl>
    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                renderInput={(props) => <TextField {...props} />}
                                label="Select Date"
                            />
                        </LocalizationProvider>
                    </FormControl>
    
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mb: 2, p: 1, fontWeight: "bold" }}
                    >
                        Filter
                    </Button>
    
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={refreshPage}
                        sx={{ p: 1, fontWeight: "bold" }}
                    >
                        Refresh
                    </Button>
                </form>
            </Paper>
        </Grid>
    
            {/* Right Half - Scrollable Paper with Cards */}
            <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ maxHeight: 650, overflow: 'auto', p: 2, my: 2, minHeight: '650px' }}>
            {data.map((appointment) => {
                const statusColor = appointment.status === 'cancelled' ? 'red' :
                                   appointment.status === 'rescheduled' ? 'orange' :
                                   appointment.status === 'upcoming' ? 'blue' : 'green';
    
                                   const isDisabled = appointment.status !== "upcoming" || appointment.appointmentType !== "regular";
                                   const disabledReason = isDisabled ? "Only upcoming and regular appointments can be rescheduled or cancelled." : "";                   
    
                return (
                    <Card key={appointment._id} sx={{ minWidth: 275, backgroundColor: '#fff', marginBottom: 2, padding: 1, display: 'flex', alignItems: 'center' }}>
                        <Tooltip title={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}>
                            <div style={{ height: 20, width: 20, borderRadius: '50%', backgroundColor: statusColor, marginRight: 2 }} />
                        </Tooltip>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" component="div" sx={{ fontWeight: 'normal' }}>
                                With <span style={{ fontWeight: 'bold' }}>{appointment.doctor?.name || "N/A"}</span>
                            </Typography>
                            <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                                {dayjs(appointment.date).format("MMMM D, YYYY h:mm A")}
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center', flexGrow: 0 }}>
                            <Tooltip title={disabledReason} arrow>
                                <span>
                                    <Button 
                                        size="small" 
                                        style={{ color: 'blue' }}
                                        disabled={isDisabled}
                                        onClick={() => handleRescheduleClick(appointment._id, appointment.doctor._id)}
                                        sx={{
                                            opacity: isDisabled ? 0.5 : 1,  // Dim the button if disabled
                                            '&:hover': {
                                                backgroundColor: isDisabled ? 'transparent' : '',  // Prevent hover effects if disabled
                                            },
                                        }}
                                    >
                                        Reschedule
                                    </Button>
                                </span>
                            </Tooltip>
                            <Tooltip title={disabledReason} arrow>
                                <span>
                                    <Button 
                                        size="small" 
                                        style={{ color: 'red' }}
                                        disabled={isDisabled}
                                        onClick={() => handleCancelClick(appointment._id)}
                                        sx={{
                                            opacity: isDisabled ? 0.5 : 1,  // Dim the button if disabled
                                            '&:hover': {
                                                backgroundColor: isDisabled ? 'transparent' : '',  // Prevent hover effects if disabled
                                            },
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </span>
                            </Tooltip>
                        </CardActions>
                    </Card>
                );
            })}
        </Paper>
    </Grid>
    
    
          </Grid>
    
    
         
        </Container>
    
    
    
      );
      
    }