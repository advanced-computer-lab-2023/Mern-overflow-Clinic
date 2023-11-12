import {
  Input,
  Container,
  Button,
  List,
  ListItem,
  Paper,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Typography,
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

export default function PatientViewPrescriptions() {
  const [data, setData] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState({});

  const id = "655089b786a7e9fff5d1d36a";

  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/patients/${id}/prescriptions`, {
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
    let doctor = e.target[0].value;
    let filled = e.target[1].value;
    let date = e.target[3].value;

    axios
      .post(`http://localhost:8000/patients/${id}/prescriptionsFilter`, {
        doctorName: doctor,
        date: date,
        filled: filled === "filled" ? "true" : "false",
      })
      .then((res) => {
        setData(res.data);
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
                <InputLabel id="doctor">Doctor Name</InputLabel>
                <Input placeholder="Search..." />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="filter-by-filled"></InputLabel>
                <Select
                  labelId="filter-by-filled"
                  id="filter-by-filled"
                  label="filled"
                  defaultValue="filled"
                  uncontrolled="true"
                  fullWidth
                >
                  <MenuItem value="filled">Filled</MenuItem>
                  <MenuItem value="unfilled">Unfilled</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    slotProps={{
                      actionBar: {
                        actions: ["clear"],
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
            <TableCell key="medicine">Medicine</TableCell>
            <TableCell key="filled">Filled</TableCell>
            <TableCell key="date">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.patient.name}>
              <TableCell>{row.patient.name}</TableCell>
              <TableCell>{row.doctor.name}</TableCell>
              {row.medicine[0] && (
              <TableCell>{row.medicine[0]}</TableCell>
              )}

              <TableCell>{row.filled.toString()}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>
                <Button onClick={() => setSelectedPrescription(row)}>
                  Select Prescription
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {typeof selectedPrescription.patient !== "undefined" && (
        <List>
          <ListItem>{"Patient: " + selectedPrescription.patient.name}</ListItem>
          <ListItem>{"Doctor: " + selectedPrescription.doctor.name}</ListItem>
          {selectedPrescription.medicine.map((med) => (
            <ListItem>{"Medicine: " + med.name}</ListItem>
          ))}
          <ListItem>{"Filled: " + selectedPrescription.filled}</ListItem>
          <ListItem>{"Date: " + selectedPrescription.date}</ListItem>
        </List>
      )}
    </Container>
  );
}
