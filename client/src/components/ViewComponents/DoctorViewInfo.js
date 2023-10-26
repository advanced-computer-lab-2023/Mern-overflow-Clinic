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

export default function PatientViewInfo() {
  const [data, setData] = useState([]);

  const id = "65293c2cb5a34d208108cc33";

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
            <TableCell>Hourly Rate</TableCell>
            <TableCell>Affiliation</TableCell>
            <TableCell>Specialty</TableCell>
            <TableCell>Education</TableCell>
            <TableCell>Wallet Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{data.name}</TableCell>
            <TableCell>
              {new Date(data.dateOfBirth).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </TableCell>
            <TableCell>{data.hourlyRate}</TableCell>
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
