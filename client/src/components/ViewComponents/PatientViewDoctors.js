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
//import { useHistory } from 'react-router-dom';
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
import { useUser } from '../../userContest';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



export default function DoctorViewPatients() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [Query, setQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState({});
  const [availableSpecialties, setAvailableSpecialties] = useState([]);
  const { userId } = useUser();
  // const id = "6529347d1b1e1b92fd454eff";
  const id = userId;

  const fetchTableData = () => {

    axios.get(`http://localhost:8000/patients/${id}/price`, {params: {id: id} }).then((res) => {


      console.log(res.data)
      setData(res.data);
      let temp = [];
      res.data.map((key) => {
        if (temp.indexOf(key._doc.speciality) === -1) {
          temp.push(key._doc.speciality);
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

    console.log(speciality)
    console.log(datetime)

    if (datetime === "") {

        axios
          .post(`http://localhost:8000/doctors/filter`, {
            speciality: speciality,
            id: id,
          })
          .then((res) => {
            setData(res.data);
          }); 
    } else {
      axios
        .post(`http://localhost:8000/doctors/filter`, {
          speciality: speciality,
          date: datetime,
          id: id,
        })
        .then((res) => {

          setData(res.data);
        })
        .catch(() => setData([]));
    }
  };
  const handleSelectDoctor = (selectedDoctor) => {
    // Construct the URL for the doctor details page in the patient section
    const doctorDetailsURL = `/patient/bookAppointment`;
    // Add the 'id' parameter to the URL
    const doctorDetailsURLWithId = `${doctorDetailsURL}/${selectedDoctor._doc._id}`;
    
    // Navigate to the doctor details page with the 'id' parameter
    navigate(doctorDetailsURLWithId);
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
              row._doc.name.toLowerCase().includes(Query.toLowerCase()) && (
                <TableRow key={row.username}>
                  <TableCell>{row._doc.name}</TableCell>
                  <TableCell>{row._doc.speciality}</TableCell>
                  <TableCell>{row.sessionPrice}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleSelectDoctor(row)}>
                     Book An Appointment
                    </Button>
                  </TableCell>
                </TableRow>
              ),
          )}
        </TableBody>
      </Table>
      {typeof (selectedDoctor._doc) !== "undefined" && (
        <List>
          <ListItem>{"Name: " + selectedDoctor._doc.name}</ListItem>
          <ListItem>{"Specialty: " + selectedDoctor._doc.speciality}</ListItem>
          <ListItem>{"Affiliation: " + selectedDoctor._doc.affiliation}</ListItem>
          <ListItem>{"Education: " + selectedDoctor._doc.education}</ListItem>
        </List>
      )
      }
    </Container>
  );
}
