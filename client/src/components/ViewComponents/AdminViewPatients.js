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
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";

export default function AdminViewPatients() {
  const [data, setData] = useState([]);
  const [Query, setQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState({});

  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/patients`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error getting Patient data", error);
      });
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/patients/${id}`)
      .then((response) => {
        console.log("DELETE request successful", response);
        fetchTableData();
      })
      .catch((error) => {
        console.error("Error making DELETE request", error);
      });
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
                bordered
                clearable
                placeholder="Search..."
                onChange={(e) => setQuery(e.target.value)}
                fullWidth
              />
            </Container>
          </Container>
        </Container>
      </Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell key="username">Username</TableCell>
            <TableCell key="name">Name</TableCell>
            <TableCell key="email">Email</TableCell>
            <TableCell key="dateOfBirth">Date of Birth</TableCell>
            <TableCell key="gender">Gender</TableCell>
            <TableCell key="mobileNumber">Mobile Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(
            (row) =>
              row.name.toLowerCase().includes(Query.toLowerCase()) && (
                <TableRow key={row.username}>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.dateOfBirth}</TableCell>
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>{row.mobileNumber}</TableCell>
                  <TableCell>
                    <Button onClick={() => setSelectedPatient(row)}>
                      Select Patient
                    </Button>
                  </TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleDelete(row._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ),
          )}
        </TableBody>
      </Table>
      {typeof selectedPatient.name !== "undefined" && (
        <List>
          <ListItem>{"Name: " + selectedPatient.name}</ListItem>
          <ListItem>{"Email: " + selectedPatient.email}</ListItem>
          <ListItem>{"Date of Birth: " + selectedPatient.dateOfBirth}</ListItem>
          <ListItem>{"Gender: " + selectedPatient.gender}</ListItem>
          <ListItem>
            {"Mobile Number: " + selectedPatient.mobileNumber}
          </ListItem>
          <Typography>Emergency Contacts</Typography>  
              <List>
                <ListItem>{"Name: " + selectedPatient.emergencyContact.name}</ListItem>
                <ListItem>{"Mobile Number: " + selectedPatient.emergencyContact.mobileNumber}</ListItem>
                <ListItem>{"Relation: " + selectedPatient.emergencyContact.relation}</ListItem>
              </List>
        </List>
      )}
    </Container>
  );
}
