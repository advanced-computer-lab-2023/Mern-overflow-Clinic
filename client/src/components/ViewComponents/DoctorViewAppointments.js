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
import dayjs from "dayjs"; // Import dayjs for date manipulation
import { useUser } from "../../userContest";

export default function DoctorViewAppointments() {
  const [data, setData] = useState([]);
  const { userId } = useUser();

  const id = userId;

  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/appointments/all/${id}`, {})
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error getting Appointment data", error);
      });
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const calculateState = (appointmentDate) => {
    const currentDate = dayjs();
    const formattedAppointmentDate = dayjs(appointmentDate);

    return formattedAppointmentDate.isAfter(currentDate) ? "upcoming" : "past";
  };

  const handleFilter = (e) => {
    e.preventDefault();
    let status = e.target[0].value;
    let date = e.target[2].value;
    //date = dayjs(date).toISOString();

    if (date === "") {
      axios
        .post(`http://localhost:8000/appointments/filter/${id}`, {
          status: status,
        })
        .then((res) => {
          console.log(res.data);

          setData(res.data);
          console.log(data);
        })
        .catch(() => setData([]));
    } else {
      axios
        .post(`http://localhost:8000/appointments/filter/${id}`, {
          status: status,
          date: date,
        })
        .then((res) => {
          setData(res.data);
          console.log(date);
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
                  <MenuItem value="cancelled">Cancelled</MenuItem>
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
      <Button
        fullWidth
        variant="contained"
        onClick={fetchTableData}
        sx={{ mt: 3, mb: 2, p: 2, fontWeight: "bold" }}
      >
        View All
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell key="patient">Patient</TableCell>
            <TableCell key="doctor">Doctor</TableCell>
            <TableCell key="duration">Duration</TableCell>
            <TableCell key="date">Date</TableCell>
            <TableCell key="status">Status</TableCell>
            <TableCell key="state">State</TableCell> {/* New column */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map((row) => (
              <TableRow
                key={
                  row.date +
                  (row.patient?.name || "") +
                  (row.doctor?.name || "") +
                  row.status +
                  Math.random()
                }
              >
                <TableCell>{row.patient?.name || "N/A"}</TableCell>
                <TableCell>{row.doctor?.name || "N/A"}</TableCell>
                <TableCell>{row.duration + " hour"}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{calculateState(row.date)}</TableCell>
              </TableRow>
            ))}
          {console.log(data)}
        </TableBody>
      </Table>
    </Container>
  );
}
