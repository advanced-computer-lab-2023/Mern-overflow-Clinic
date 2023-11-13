import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useUser } from '../../userContest';

const AvailableSlotsTable = ({ availableSlots }) => (
  <TableContainer component={Paper} sx={{ mt: 4 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Time Slot</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {availableSlots.map((slot) => (
          <TableRow key={slot.id}>
            <TableCell>{slot.date}</TableCell>
            <TableCell>{slot.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const PatientManageAppointments = ({ doctorId }) => {
  const { id } = useParams();
  const [bookForRelative, setBookForRelative] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState("");
  const [selectedFamilyMemberID, setSelectedFamilyMemberID] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [docID, setDocID] = useState(id);
  const { userId } = useUser();
  let patID = userId;
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (bookForRelative) {
      const fetchFamilyMembers = () => {
        axios
          .get(`http://localhost:8000/patients/${patID}/family`)
          .then((res) => {
            setFamilyMembers(res.data || []);
          })
          .catch((error) => {
            console.error(error);
          });
      };

      fetchFamilyMembers();
    }

    axios
      .get(`http://localhost:8000/doctors/${doctorId}/slots`)
      .then((res) => {
        const currentTime = new Date().getTime();
        const filteredSlots = res.data.filter((slot) => new Date(slot.date + ' ' + slot.time).getTime() > currentTime);
        setAvailableSlots(filteredSlots);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bookForRelative, doctorId, patID]);

  const handleBookForRelativeChange = (e) => {
    setBookForRelative(e.target.checked);
    if (!e.target.checked) {
      setSelectedFamilyMember("");
    }
  };

  const handleFamilyMemberChange = (e) => {
    const selectedName = e.target.value;
    const selectedMember = familyMembers.find((member) => member.name === selectedName);
    const selectedID = selectedMember ? selectedMember._id : null;
    setSelectedFamilyMember(selectedName);
    setSelectedFamilyMemberID(selectedID);
  };

  const handleBookingAppointment = () => {
    if (!selectedDate) {
      setStatusMessage("Please fill in all required fields.");
      setIsSuccess(false);
      return;
    }
  
    if (bookForRelative && !selectedFamilyMemberID) {
      setStatusMessage("Please select a family member.");
      setIsSuccess(false);
      return;
    }
  
    const appointmentData = {
      doctor: docID,
      relativeId: selectedFamilyMemberID,
      date: selectedDate,
      flag: bookForRelative,
    };
  
    axios
      .post(`http://localhost:8000/appointments/createAppointmentsForRelations/${patID}`, appointmentData)
      .then((res) => {
        const successMessage = "Appointment booked successfully";
        setStatusMessage(successMessage);
        setIsSuccess(true);
  
        setSelectedDate("");
        setSelectedFamilyMember("");
        setSelectedFamilyMemberID(null);
        setBookForRelative(false);
      })
      .catch((error) => {
        const errorMessage = "Error booking appointment. Please try again.";
        setStatusMessage(errorMessage);
        setIsSuccess(false);
        console.error(error);
      });
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: "20px", my: "40px" }}>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Schedule An Appointment
        </Typography>
        <Box component="form">
          <FormControlLabel
            control={
              <Checkbox
                checked={bookForRelative}
                onChange={handleBookForRelativeChange}
                name="bookForRelative"
              />
            }
            label="Booking for a relative?"
          />
          <TextField
            sx={{ mb: 3 }}
            type="date"
            label=""
            fullWidth
            required
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            inputProps={{ min: new Date().toISOString().split("T")[0] }}
          />

          {bookForRelative && (
            <FormControl sx={{ mb: 3 }} fullWidth>
              <InputLabel htmlFor="family-member-select">
                Select a Family Member
              </InputLabel>
              <Select
                labelId="family-member-select-label"
                id="family-member-select"
                value={selectedFamilyMember}
                onChange={handleFamilyMemberChange}
                label="Family Member"
              >
                {familyMembers.map((member) => (
                  <MenuItem key={member.name} value={member.name}>
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

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
        </Box>

        {availableSlots.length > 0 && <AvailableSlotsTable availableSlots={availableSlots} />}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button variant="contained" onClick={handleBookingAppointment}>
            Book
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientManageAppointments;
