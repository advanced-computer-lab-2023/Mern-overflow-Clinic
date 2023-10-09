import {
  Input,
  InputLabel,
  TextField,
  Grid,
  Select,
  MenuItem,
  Button,
  Box,
  Container,
  FormControl,
  Typography,
  Divider,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Fuse from "fuse.js";
import axios from "axios";

const columns = [
  {
    key: "username",
    label: "USERNAME",
  },

  {
    key: "name",
    label: "NAME",
  },

  {
    key: "email",
    label: "EMAIL",
  },

  {
    key: "dateOfBirth",
    label: "DATE OF BIRTH",
  },

  {
    key: "gender",
    label: "GENDER",
  },

  {
    key: "mobileNumber",
    label: "MOBILE NUMBER",
  },
];

export default function DoctorViewPatients() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const fetchTableData = () => {
    axios.get(`http://localhost:8000/patients`).then((res) => {
      setData(res.data);
      setFilteredData(res.data);
    });
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const searchItem = (query) => {
    if (!query) {
      setFilteredData(data);
      return;
    }
    const fuse = new Fuse(filteredData, {
      keys: ["name"],
      threshold: 0.3,
    });
    const result = fuse.search(query);
    const finalResult = [];
    if (result.length) {
      result.forEach((item) => {
        finalResult.push(item.item);
      });
      setFilteredData(finalResult);
    } else {
      setFilteredData([]);
    }
  };

  return (
    <Container>
      <Container>
        <Input
          size="lg"
          bordered
          clearable
          placeholder="Search..."
          onChange={(e) => searchItem(e.target.value)}
        />
      </Container>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row) => (
            <TableRow key={row.username}>
              <TableCell>{row.username}</TableCell>
              <TableCell>{row.name}</TableCell>

              <TableCell>{row.email}</TableCell>
              <TableCell>{row.dateOfBirth}</TableCell>
              <TableCell>{row.gender}</TableCell>
              <TableCell>{row.mobileNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
