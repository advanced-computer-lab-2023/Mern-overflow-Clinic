import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Dialog, DialogContent, DialogTitle, IconButton,
  Button, FormControl, DialogActions,InputLabel, Select, MenuItem,
  Snackbar, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ReschedulePopup = ({ open, onClose, appointmentId , doctorId}) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [rescheduleMessage, setRescheduleMessage] = useState("");
  const [rescheduleMessageOpen, setRescheduleMessageOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  useEffect(() => {

    if (open) { // Ensure doctorId is available
      axios.get(`http://localhost:8000/doctors/${doctorId}/slots`)
        .then(response => {
          setAvailableSlots(response.data);
        })
        .catch(error => console.error('Error fetching slots', error));
    }
  }, [open, doctorId]); 
  

  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
  };

  const handleReschedule = () => {
    setConfirmationOpen(true);
  };

  const confirmReschedule = () => {
    setConfirmationOpen(false);
  
    axios.put(`http://localhost:8000/appointments/reschedule/${appointmentId}`, {
      date: selectedSlot
    }).then(response => {
      setSnackbarMessage("Appointment successfully rescheduled.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => { // Optional: timeout before refreshing
        window.location.reload(); // Refresh the page
      }, 3000); // Adjust the timeout duration as needed
    }).catch(error => {
      console.error('Error rescheduling appointment', error);
      setSnackbarMessage("Failed to reschedule the appointment.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    });
  };
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      
      <DialogTitle>
        Reschedule Appointment
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <p>Please select a new time slot for your appointment:</p>
        <FormControl fullWidth margin="normal">
          <InputLabel id="slot-selector-label">New Time Slot</InputLabel>
          <Select
            labelId="slot-selector-label"
            id="slot-selector"
            value={selectedSlot}
            label="New Time Slot"
            onChange={handleSlotChange}
          >
            {
            availableSlots.map(slot => {
                const startTime = dayjs(slot);
                const endTime = startTime.add(1, 'hour');
                return (
                <MenuItem key={slot} value={slot}>
                    {`${startTime.format('MMMM D, YYYY h:mm A')} - ${endTime.format('h:mm A')}`}
                </MenuItem>
                );
            })
            }

          </Select>
        </FormControl>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleReschedule} 
          disabled={!selectedSlot}
          fullWidth
          sx={{ mt: 2 }}
        >
          Reschedule
        </Button>
      </DialogContent>

      <Dialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
      >
        <DialogTitle>Confirm Reschedule</DialogTitle>
        <DialogContent>
          {`Are you sure you want to reschedule to ${dayjs(selectedSlot).format('MMMM D, YYYY h:mm A')}?`}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)}>No</Button>
          <Button onClick={confirmReschedule}>Yes</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={rescheduleMessageOpen} onClose={() => setRescheduleMessageOpen(false)}>
        <DialogTitle>
            Reschedule Status
            <IconButton
            aria-label="close"
            onClick={() => {
                setRescheduleMessageOpen(false);
                onClose(); // This will close the entire ReschedulePopup
            }}
            sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
            }}
            >
            <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
            {rescheduleMessage}
        </DialogContent>
        <DialogActions>
            <Button 
            onClick={() => {
                setRescheduleMessageOpen(false);
                onClose(); // This will also close the entire ReschedulePopup
            }}
            >
            OK
            </Button>
        </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Positioning the Snackbar at the top center

        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Dialog>
            
        );
        
        };

export default ReschedulePopup;
