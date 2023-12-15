import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

const ReschedulePopup = ({ open, onClose, appointmentId }) => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [confirmationOpen, setConfirmationOpen] = useState(false);
  
    useEffect(() => {
      if (open) {
        // Replace 'doctorId' with the actual doctor ID from the appointment data
        const doctorId = 'doctorId'; // You need to fetch the correct doctor ID
        axios.get(`http://localhost:8000/doctors/${doctorId}/slots`)
          .then(response => {
            setAvailableSlots(response.data);
          })
          .catch(error => console.error('Error fetching slots', error));
      }
    }, [open]);
  
    const handleSlotChange = (event) => {
      setSelectedSlot(event.target.value);
    };
  
    const handleReschedule = () => {
      setConfirmationOpen(true);
    };
  
    const confirmReschedule = () => {
      setConfirmationOpen(false);
      onClose();
  
      axios.post(`http://localhost:8000/appointments/reschedule/${appointmentId}`, {
        date: selectedSlot
      }).then(response => {
        console.log("Appointment rescheduled", response);
        // You might want to refresh the appointments list here
      }).catch(error => console.error('Error rescheduling appointment', error));
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Reschedule Appointment</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="slot-selector-label">Select a New Slot</InputLabel>
            <Select
              labelId="slot-selector-label"
              id="slot-selector"
              value={selectedSlot}
              label="Select a New Slot"
              onChange={handleSlotChange}
            >
              {availableSlots.map(slot => (
                <MenuItem key={slot} value={slot}>{dayjs(slot).format('MMMM D, YYYY h:mm A')}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleReschedule} disabled={!selectedSlot}>Reschedule</Button>
        </DialogActions>
  
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
      </Dialog>
    );
  };

  export default ReschedulePopup;
