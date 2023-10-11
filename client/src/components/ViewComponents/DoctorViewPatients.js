import { Input, Container, Button, List, ListItem } from "@mui/material";
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
  const [selectedPatient, setSelectedPatient] = useState({});

  useEffect(() => {
    console.log(selectedPatient);
  }, []);

  const fetchTableData = () => {
    axios.get(`http://localhost:8000/patients`).then((res) => {
      setData(res.data);
    });
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  return (
    <Container>
      <Container>
        <Input
          size="lg"
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </Container>
      <Table>
        <TableHead>
          <TableRow>
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
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.dateOfBirth}</TableCell>
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>{row.mobileNumber}</TableCell>
                  <TableCell>
                    <Button onClick={setSelectedPatient(row)}>
                      Select Patient
                    </Button>
                  </TableCell>
                </TableRow>
              ),
          )}
        </TableBody>
      </Table>
      {selectedPatient !== {} &&
        selectedPatient.map((value) => (
          <List>
            <ListItem>{value}</ListItem>
          </List>
        ))}
    </Container>
  );
}
