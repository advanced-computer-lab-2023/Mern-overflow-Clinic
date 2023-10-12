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

export default function PatientViewFamilyMembers() {
  const [data, setData] = useState([]);

  const id = "6525bfc47ad8f4f09edd6e12";

  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/patients/${id}/relatives`, {
        params: { id: id },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      });
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  return (
    <Container maxWidth="xl">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell key="name">Name</TableCell>
            <TableCell key="nationalId">National ID</TableCell>
            <TableCell key="age">Age</TableCell>
            <TableCell key="gender">Gender</TableCell>
            <TableCell key="relation">Relation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.name + row.nationalId + row.age + row.gender}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.nationalId}</TableCell>
              <TableCell>{row.age}</TableCell>
              <TableCell>{row.gender}</TableCell>
              <TableCell>{row.relation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
