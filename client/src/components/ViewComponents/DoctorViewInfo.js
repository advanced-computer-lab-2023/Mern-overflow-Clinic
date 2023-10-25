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

export default function DoctorViewInfo() {
  const [data, setData] = useState([]);

  const id = "652980600250b997003a23ce";

  const fetchTableData = () => {
      axios
        .get(`http://localhost:8000/doctors/${id}`)
        .then((res) => {
          setData(res.data);
          console.log(res.data);
        })
        .catch((error) => {
          console.error(error);
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
            <TableCell>Doctor Name</TableCell>
            <TableCell>BirthDate</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Affiliation</TableCell>
            <TableCell>Specialty</TableCell>
            <TableCell>Education</TableCell>
            <TableCell>Wallet Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{data.name}</TableCell>
            <TableCell>{data.dateOfBirth}</TableCell>
            <TableCell>{data.gender}</TableCell>
            <TableCell>{data.affiliation}</TableCell>
            <TableCell>{data.speciality}</TableCell>
            <TableCell>{data.education}</TableCell>
            <TableCell>{data.wallet}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Container>
  );
}
