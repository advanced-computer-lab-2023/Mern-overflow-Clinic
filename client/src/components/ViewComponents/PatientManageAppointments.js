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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUser } from "../../userContest";

const PatientManageAppointments = ({ doctorId }) => {
  const { id } = useParams();
  const [bookForRelative, setBookForRelative] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState("");
  const [selectedFamilyMemberID, setSelectedFamilyMemberID] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slots, setSlots] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [docID, setDocID] = useState(id);
  const { userId } = useUser();
  const [hourlyRate, setHourlyRate] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch doctor's hourly rate
        const doctorResponse = await axios.get(`http://localhost:8000/doctors/${docID}`);
        setHourlyRate(doctorResponse.data.hourlyRate);

        const slotsResponse = await axios.get(`http://localhost:8000/doctors/${docID}/slots`);
        setSlots(slotsResponse.data);

        if (bookForRelative) {
          const familyMembersResponse = await axios.get(`http://localhost:8000/patients/${userId}/family`);
          setFamilyMembers(familyMembersResponse.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [docID, userId, bookForRelative]);

  const handleBookForRelativeChange = (e) => {
    setBookForRelative(e.target.checked);
    if (!e.target.checked) {
      setSelectedFamilyMember("");
    }
  };

  const handleFamilyMemberChange = (e) => {
    const selectedName = e.target.value;
    const selectedMember = familyMembers.find((member) => member.name === selectedName);
  
    console.log("Selected Name:", selectedName);
    console.log("Selected Member:", selectedMember);
  
    if (selectedMember) {
      setSelectedFamilyMember(selectedMember.name);
      setSelectedFamilyMemberID(selectedMember.patientId); // Assuming _id is the correct property for the member's identifier
    } else {
      console.log("Member not found");
      setSelectedFamilyMember("");
      setSelectedFamilyMemberID(null);
    }
  };
  
  
  
  const handleSlotChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedSlot(selectedValue);
  };

  const handleBookingAppointment = async () => {
    try {
      if (!selectedSlot) {
        setStatusMessage("Please select a time slot.");
        setIsSuccess(false);
        return;
      }

      if (bookForRelative && !selectedFamilyMemberID) {
        setStatusMessage("Please select a family member.");
        setIsSuccess(false);
        return;
      }

      const formattedStartDate = formatDate(new Date(selectedSlot));
      const formattedEndDate = formatDate(addOneHour(new Date(selectedSlot)));

      const appointmentData = {
        doctor: docID,
        relativeId: selectedFamilyMemberID,
        date: selectedSlot,
        flag: bookForRelative,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      await axios.post(`http://localhost:8000/appointments/createAppointmentsForRelations/${userId}`, appointmentData);

      const successMessage = "Appointment booked successfully";
      setStatusMessage(successMessage);
      setIsSuccess(true);

      // Update local state instead of fetching again
      setSlots((prevSlots) => prevSlots.filter((slot) => slot !== selectedSlot));

      if (bookForRelative) {
        const familyMembersResponse = await axios.get(`http://localhost:8000/patients/${userId}/family`);
        setFamilyMembers(familyMembersResponse.data || []);
      }

      setSelectedSlot("");
      setSelectedFamilyMember("");
      setSelectedFamilyMemberID(null);
      setBookForRelative(false);
    } catch (error) {
      const errorMessage = "Error booking appointment. Please try again.";
      setStatusMessage(errorMessage);
      setIsSuccess(false);
      console.error(error);
    }
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
          {hourlyRate && (
            <Typography variant="body1" sx={{ mb: 3 }}>
              Doctor's Hourly Rate: EGP {hourlyRate}
            </Typography>
          )}
          <FormControl sx={{ mb: 3 }} fullWidth>
            <InputLabel htmlFor="slot-select">Select a Time Slot</InputLabel>
            <Select
              labelId="slot-select-label"
              id="slot-select"
              value={selectedSlot}
              onChange={handleSlotChange}
              label="Time Slot"
            >
              {slots.length === 0 ? (
                <MenuItem disabled>No available time slots</MenuItem>
              ) : (
                slots.map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {`${formatDate(new Date(slot))} - ${formatDate(addOneHour(new Date(slot)))}`}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

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
                    {console.log(member)}
                  </MenuItem>
                ))}
                {console.log(selectedFamilyMember)}
                
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

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hour12: true };
  return new Date(dateString).toLocaleString("en-US", options);
};

const addOneHour = (date) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + 1);
  return newDate;
};
