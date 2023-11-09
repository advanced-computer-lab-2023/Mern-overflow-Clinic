import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useParams } from 'react-router-dom';


const PatientManageAppointments = ({ doctorId }) => {
  const { id } = useParams();
  const [bookForRelative, setBookForRelative] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState("");
  const [selectedFamilyMemberID, setSelectedFamilyMemberID] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [docID, setDocID] = useState(id); // Initialize docID with the doctorId prop

  const patID = "6529362d1b1e1b92fd454f12"; // Replace with the actual patient ID

  useEffect(() => {
    if (bookForRelative) {
      const fetchFamilyMembers = () => {
        axios
          .get(`http://localhost:8000/patients/${patID}/family`)
          .then((res) => {
            setFamilyMembers(res.data);
          })
          .catch((error) => {
            console.error(error);
          });
      };

      fetchFamilyMembers();
    }
  }, [bookForRelative]);

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
    //const selectedID = "123343423214ggs";
    setSelectedFamilyMember(selectedName);
    setSelectedFamilyMemberID(selectedID);
  };

  const handleBookingAppointment = () => {
    if (!bookForRelative) {
      setSelectedFamilyMemberID(null);
    }

    const appointmentData = {
      doctor: docID,
      relativeId: selectedFamilyMemberID,
      date:selectedDate,
      flag: bookForRelative,
    };

    axios
    .post(`http://localhost:8000/appointments/createAppointmentsForRelations/${patID}`, appointmentData)
    .then((res) => {
      const successMessage = "Appointment booked successfully";
      setStatusMessage(successMessage);
      setIsSuccess(true); // Set isSuccess to true

      // Reset the form
      setSelectedDate(""); // Clear selectedDate
      setSelectedFamilyMember(""); // Clear selectedFamilyMember
      setSelectedFamilyMemberID(null); // Clear selectedFamilyMemberID
      setBookForRelative(false);
    })
    .catch((error) => {
      const errorMessage = "Error booking appointment. Please try again.";
      setStatusMessage(errorMessage);
      setIsSuccess(false); // Set isSuccess to false
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
                color: isSuccess ? "green" : "red", // Display green for success
              }}
            >
              {statusMessage}
            </Typography>
          )}
        </Box>
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