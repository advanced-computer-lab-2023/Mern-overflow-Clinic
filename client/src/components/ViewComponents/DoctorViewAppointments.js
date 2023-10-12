import {
  Container,
  Button,
  Paper,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
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

export default function DoctorViewAppointments() {
  const [data, setData] = useState([]);

  const id = "6525bfc47ad8f4f09edd6e12";

  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/appointments`, {
        params: { id: id },
      })
      .then((res) => {
        setData(res.data);
      });
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    let status = e.target[0].value;
    let date = e.target[2].value;

    if (date === "") {
      axios
        .post(`http://localhost:8000/appointments/filter`, {
          status: status,
        })
        .then((res) => {
          setData(res.data);
        })
        .catch(() => setData([]));
    } else {
      axios
        .post(`http://localhost:8000/appointments/filter`, {
          status: status,
          date: date,
        })
        .then((res) => {
          setData(res.data);
        })
        .catch(() => setData([]));
    }
  };
  return (
    <Container maxWidth="xl">
      <Paper elevation={3} sx={{ p: "20px", my: "40px", paddingBottom: 5 }}>
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 5,
          }}
        >
          <Container sx={{ width: "48%" }}>
            <form onSubmit={handleFilter}>
              <FormControl fullWidth>
                <InputLabel id="filter-by-upcoming"></InputLabel>
                <Select
                  labelId="filter-by-upcoming"
                  id="filter-by-upcoming"
                  label="upcoming"
                  defaultValue="upcoming"
                  uncontrolled="true"
                  fullWidth
                >
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="canceled">Canceled</MenuItem>
                  <MenuItem value="rescheduled">Rescheduled</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    slotProps={{
                      actionBar: {
                        actions: ["accept", "clear"],
                      },
                    }}
                  ></DateTimePicker>
                </LocalizationProvider>
              </FormControl>

              <FormControl fullWidth>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, p: 2, fontWeight: "bold" }}
                >
                  Filter
                </Button>
              </FormControl>
            </form>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              onClick={fetchTableData}
              sx={{ mt: 3, mb: 2, p: 2, fontWeight: "bold" }}
            >
              Clear
            </Button>
          </Container>
        </Container>
      </Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell key="patient">Patient</TableCell>
            <TableCell key="doctor">Doctor</TableCell>
            <TableCell key="duration">Duration</TableCell>
            <TableCell key="date">Date</TableCell>
            <TableCell key="status">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.date + row.patient + row.doctor + row.status}>
              <TableCell>{row.patient}</TableCell>
              <TableCell>{row.doctor}</TableCell>
              <TableCell>{row.duration}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
