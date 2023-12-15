import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useUser } from "../../userContest";
import { useNavigate } from 'react-router-dom';

export default function DoctorViewAppointments() {
  const [data, setData] = useState([]);
  const { userId } = useUser();
  const id = userId;
  const navigate = useNavigate();

  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/patients/${id}/completedAppointments`, {})
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

  const handleBookAppointment = (selectedDoctor) => {
    // Handle the navigation to the booking page with the appointment ID
    const bookingURL = `/patient/bookFollowUp/${selectedDoctor}`;
    navigate(bookingURL);
  };

  return (
    <Container maxWidth="xl">
      <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={fetchTableData}
          style={{ marginBottom: 10, fontWeight: "bold" }}
        >
          View Completed Appointments
        </Button>
      </Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell key="doctor">Doctor</TableCell>
            <TableCell key="date">Date</TableCell>
            <TableCell key="action">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(data.appointments) && data.appointments.length > 0 ? (
            data.appointments.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.doctor && row.doctor.name}</TableCell>
                <TableCell>{dayjs(row.date).format("MMMM D, YYYY h:mm A")}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleBookAppointment(row.doctor._id)}
                    variant="contained"
                  >
                    Book A FollowUp
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>No completed appointments available.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Container>
  );
}
