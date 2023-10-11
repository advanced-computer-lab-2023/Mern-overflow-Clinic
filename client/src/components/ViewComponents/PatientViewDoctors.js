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

export default function DoctorViewPatients() {
  const [data, setData] = useState([]);
  const [Query, setQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState({});
  const [availableSpecialties, setAvailableSpecialties] = useState(["All"]);

  const id = "6525bfc47ad8f4f09edd6e12";

  const fetchTableData = () => {
    axios.get(`http://localhost:8000/doctors`).then((res) => {
      setData(res.data);
      let temp = ["All"];
      res.data.map((key) => {
        if (temp.indexOf(key.speciality) === -1) {
          temp.push(key.speciality);
        }
      });
      setAvailableSpecialties(temp);
    });
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    let speciality = e.target[0].value;
    let datetime = e.target[2].value;
    console.log(speciality);
    console.log(datetime);

    if (datetime === "") {
      if (speciality === "" || speciality === "All") {
        fetchTableData();
      } else {
        axios
          .post(`http://localhost:8000/doctors/filter`, {
            speciality: speciality,
          })
          .then((res) => {
            setData(res.data);
          });
      }
    } else if (speciality === "" || speciality === "All") {
      axios
        .post(`http://localhost:8000/doctors/filter`, {
          speciality: "",
          date: datetime,
        })
        .then((res) => {
          setData(res.data);
        })
        .catch(() => setData([]));
    } else {
      axios
        .post(`http://localhost:8000/doctors/filter`, {
          speciality: speciality,
          date: datetime,
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
        <Container>
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              my: 5,
            }}
          >
            <Container sx={{ width: "48%" }}>
              <Input
                size="lg"
                placeholder="Search..."
                onChange={(e) => setQuery(e.target.value)}
                fullWidth
              />
            </Container>
            <Container sx={{ width: "48%" }}>
              <form onSubmit={handleFilter}>
                <FormControl fullWidth>
                  <InputLabel id="filter-by-specialty">Specialty</InputLabel>
                  <Select
                    labelId="filter-by-specialty"
                    id="filter-by-specialty-select"
                    label="specialty"
                    uncontrolled="true"
                    fullWidth
                  >
                    {availableSpecialties.map((value) => (
                      <MenuItem value={value}>{value}</MenuItem>
                    ))}
                  </Select>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      slotProps={{
                        actionBar: {
                          actions: ["clear"],
                        },
                      }}
                    >
                      {" "}
                    </DateTimePicker>
                  </LocalizationProvider>

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
            </Container>
          </Container>
        </Container>
      </Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell key="name">Name</TableCell>
            <TableCell key="speciality">Specialty</TableCell>
            <TableCell key="price">Session Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(
            (row) =>
              row.name.toLowerCase().includes(Query.toLowerCase()) && (
                <TableRow key={row.username}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.speciality}</TableCell>
                  <TableCell>{row.hourlyRate}</TableCell>
                  <TableCell>
                    <Button onClick={() => setSelectedDoctor(row)}>
                      Select Doctor
                    </Button>
                  </TableCell>
                </TableRow>
              ),
          )}
        </TableBody>
      </Table>
      {typeof selectedDoctor.name !== "undefined" && (
        <List>
          <ListItem>{"Name: " + selectedDoctor.name}</ListItem>
          <ListItem>{"Specialty: " + selectedDoctor.speciality}</ListItem>
          <ListItem>{"Affiliation: " + selectedDoctor.affiliation}</ListItem>
          <ListItem>{"Education: " + selectedDoctor.education}</ListItem>
        </List>
      )}
    </Container>
  );
}
