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
  const [price, setPrice] = useState(""); // New state for price
  let patID = userId;

  useEffect(() => {
    // Fetch available slots when the component mounts
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/doctors/${docID}/slots`);
        setSlots(response.data);
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchSlots();
  }, [docID]);

  useEffect(() => {
    if (bookForRelative) {
      const fetchFamilyMembers = () => {
        axios
          .get(`http://localhost:8000/patients/${patID}/family`)
          .then((res) => {
            setFamilyMembers(res.data || []); // Check if res.data is null
          })
          .catch((error) => {
            console.error(error);
          });
      };

      fetchFamilyMembers();
    }
  }, [bookForRelative]);

  useEffect(() => {
    console.log("Slots:", slots); // Log the slots array
  }, [slots]);

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

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

  const handleSlotChange = (e) => {
    const selectedValue = e.target.value;
    console.log("Selected Slot:", selectedValue);
    setSelectedSlot(selectedValue);
  };

  const handleBookingAppointment = () => {
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

    if (!price) {
      setStatusMessage("Please enter a price.");
      setIsSuccess(false);
      return;
    }

    const appointmentData = {
      doctor: docID,
      relativeId: selectedFamilyMemberID,
      date: selectedSlot,
      flag: bookForRelative,
      price: price, // Include price in the appointment data
    };

    axios
      .post(`http://localhost:8000/appointments/createAppointmentsForRelations/${patID}`, appointmentData)
      .then((res) => {
        const successMessage = "Appointment booked successfully";
        setStatusMessage(successMessage);
        setIsSuccess(true);

        // Reset the form
        setSelectedSlot("");
        setSelectedFamilyMember("");
        setSelectedFamilyMemberID(null);
        setBookForRelative(false);
        setPrice(""); // Clear the price after successful booking
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
          <FormControl sx={{ mb: 3 }} fullWidth>
            <InputLabel htmlFor="slot-select">Select a Time Slot</InputLabel>
            <Select
              labelId="slot-select-label"
              id="slot-select"
              value={selectedSlot}
              onChange={handleSlotChange}
              label="Time Slot"
            >
              {slots.map((slot) => (
                <MenuItem key={slot} value={slot}>
                  {`${formatDate(new Date(slot))} - ${formatDate(addOneHour(new Date(slot)))}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ mb: 3 }} fullWidth>
            <InputLabel htmlFor="price-input">Enter Price</InputLabel>
            <OutlinedInput
              id="price-input"
              type="number"
              value={price}
              onChange={handlePriceChange}
              startAdornment={<InputAdornment position="start">EGP</InputAdornment>}
              label="Price"
            />
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

// Helper function to format date
const formatDate = (dateString) => {
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  return new Date(dateString).toLocaleTimeString("en-US", options);
};

// Helper function to add one hour to a date string
const addOneHour = (date) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + 1);
  return newDate;
};