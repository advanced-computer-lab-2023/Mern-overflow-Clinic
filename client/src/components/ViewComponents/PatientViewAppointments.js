import {
  // Input,
  Container,
  Button,
  // List,
  // ListItem,
  Paper,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  // Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PaymentIcon from "@mui/icons-material/Payment";

import { Link } from "react-router-dom";

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
import { useUser } from "../../userContest";

export default function PatientViewAppointments() {
  const [data, setData] = useState([]);
  const { userId } = useUser();

  // const id = "6529347d1b1e1b92fd454eff";
  console.log(userId + "hello");
  const id = userId;

  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/appointments/${id}/`, { params: { id: id } })
      .then((res) => {
        setData(res.data || []); // Check if res.data is null or undefined
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error getting data", error);
      });
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    let status = e.target[0].value;
    let date = e.target[2].value;
    let route = `http://localhost:8000/appointments/filter/${id}`;

    if (date === "") {
      axios
        .post(route, {
          status: status,
          id: id,
        })
        .then((res) => {
          console.log(res.data);
          setData(res.data || []); // Check if res.data is null or undefined
        })
        .catch(() => setData([]));
    } else {
      axios
        .post(route, {
          status: status,
          date: date,
        })
        .then((res) => {
          console.log(res.data);
          setData(res.data || []); // Check if res.data is null or undefined
        })
        .catch(() => setData([]));
    }
  };
  const handleViewAll = () => {
    // Fetch all appointments with the state attribute
    axios
      .get(`http://localhost:8000/appointments/all/${id}`)
      .then((res) => {
        setData(res.data || []);
      })
      .catch(() => setData([]));
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
        onClick={handleViewAll}
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
                  row.status
                }
              >
                <TableCell>{row.patient?.name || "N/A"}</TableCell>
                <TableCell>{row.doctor?.name || "N/A"}</TableCell>
                <TableCell>{row.duration + " hour"}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.status}</TableCell>
                <Link
                  to={
                    row.status == "upcoming"
                      ? `/patient/pay/appointment/${row._id}`
                      : undefined
                  }
                >
                  <IconButton disabled={!(row.status == "upcoming")}>
                    <PaymentIcon />
                  </IconButton>
                </Link>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Container>
  );
}
