import {
  Container,
  Paper,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import React from "react";
import axios from "axios";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Import AdapterDayjs from dayjs
import { Typography } from "@mui/material";
import { useUser } from "../../userContest";
//import AdapterDateFns from "@mui/x-date-pickers/AdapterDateFns"; // Choose the appropriate date adapter
import { useEffect, useState } from "react";

export default function DoctorAddSlots() {
  const [date, setDate] = useState(null);
  const [message, setMessage] = useState("");
  const { userId } = useUser();
  let id = userId;

  //const id = "65293c2cb5a34d208108cc33";


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date) {
      setMessage("Please select a date.");
      return; // Exit early, no need to make a request
    }

    axios
      .put(`http://localhost:8000/doctors/${id}/addSlots`, {
        date: date,
      })
      .then((res) => {
        if (res.status === 200) {
          setMessage("Slot added successfully.");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setMessage("Bad request. Please check the provided data.");
        } else if (error.response && error.response.status === 401) {
          setMessage("You have not entered a date.");
        } else if (error.response && error.response.status === 402) {
          setMessage("'You have not yet been accepted or accepted a contract.");
        } else if (error.response && error.response.status === 403) {
          setMessage("This slot has already been added.");
        } else if (error.response && error.response.status === 404) {
          setMessage("Error 404: Not Found");
        } else if (error.response && error.response.status === 405) {
          setMessage("You cannot use a past date.");
        } else if (error.response && error.response.status === 406) {
          setMessage("You already have an appointment on that date and time");
        }
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: "20px", my: "40px" }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add a free slot start time
            </Typography>
            <FormControl fullWidth>
              <DateTimePicker value={date} onChange={setDate} />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mb: 3, p: 1.8, fontWeight: "bold", marginTop: 2 }}
            >
              Add Slot
            </Button>
          </form>
          {message && <div>{message}</div>}
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}
