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
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../userContest";

const PatientManageAppointments = () => {
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
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
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

    if (selectedMember) {
      setSelectedFamilyMember(selectedMember.name);
      setSelectedFamilyMemberID(selectedMember.patientId);
    } else {
      setSelectedFamilyMember("");
      setSelectedFamilyMemberID(null);
    }
  };

  const formatDateAndSubtractTwoHours = (date) => {
    const modifiedDate = new Date(date.getTime() - 2 * 60 * 60 * 1000);
    const formattedDate = `${modifiedDate.getFullYear()}-${(modifiedDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${modifiedDate.getDate().toString().padStart(2, "0")} ${modifiedDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${modifiedDate.getMinutes().toString().padStart(2, "0")}:${modifiedDate
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    return formattedDate;
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

      const formattedStartDate = formatDate(formatDateAndSubtractTwoHours(new Date(selectedSlot)));
      const formattedEndDate = formatDate(formatDateAndSubtractTwoHours(addOneHour(new Date(selectedSlot))));

      const appointmentData = {
        date: selectedSlot,
        status: "rescheduled",
      };

      await axios.put(`http://localhost:8000/appointments/${userId}/reschedule/`, appointmentData);

      const successMessage = "Appointment rescheduled successfully";
      setStatusMessage(successMessage);
      setIsSuccess(true);

      setSlots((prevSlots) => prevSlots.filter((slot) => slot !== selectedSlot));

      setSelectedSlot("");
      setSelectedFamilyMember("");
      setSelectedFamilyMemberID(null);
      setBookForRelative(false);

      // Navigate to the next page with appointment ID and doctor ID
      navigate(`/your-next-page/${userId}/${docID}`);
    } catch (error) {
      const errorMessage = "Error rescheduling appointment. Please try again.";
      setStatusMessage(errorMessage);
      setIsSuccess(false);
      console.error(error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: "20px", my: "40px" }}>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Reschedule An Appointment
        </Typography>
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
                  {`${formatDate(formatDateAndSubtractTwoHours(new Date(slot)))} - ${formatDate(
                    formatDateAndSubtractTwoHours(addOneHour(new Date(slot)))
                  )}`}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {bookForRelative && (
          <FormControl sx={{ mb: 3 }} fullWidth>
            <InputLabel htmlFor="family-member-select">Select a Family Member</InputLabel>
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button variant="contained" onClick={handleBookingAppointment}>
            Reschedule
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientManageAppointments;

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hour12: true };

  const clientTimeZoneOffset = new Date().getTimezoneOffset();
  const adjustedDate = new Date(new Date(dateString).getTime());

  return adjustedDate.toLocaleString("en-US", options);
};

const addOneHour = (date) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + 1);
  return newDate;
};
