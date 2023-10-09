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
    key: "affiliation",
    label: "AFFILIATION",
  },

  {
    key: "education",
    label: "EDUCATION",
  },
  {
    key: "status",
    label: "STATUS",
  },

  {
    key: "speciality",
    label: "SPECIALITY",
  },
  {
    key: "hourlyrate",
    label: "HOURLY RATE",
  },
];

export default function AdminViewPatients() {
  const [data, setData] = useState([]);
  const [uniqueSpecialties, setUniqueSpecialties] = useState(["No filter"]);
  const [filteredData, setFilteredData] = useState([]);

  const fetchTableData = () => {
    axios.get(`http://localhost:8000/doctors`).then((res) => {
      let temp = ["No filter"];

      res.data.map((key) => {
        if (temp.indexOf(key.speciality) === -1) {
          temp.push(key.speciality);
        }
      });

      setUniqueSpecialties(temp);

      setData(res.data);
      setFilteredData(res.data);
    });
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    let filter = e.target.value;
    console.log(filter);

    let filteredData = data.filter(
      (row) => filter === "No filter" || row.speciality === filter,
    );
    setFilteredData(filteredData);
  };

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
      <Container>
        <FormControl>
          <InputLabel id="filter-by-speciality">Specialty</InputLabel>
          <Select
            labelId="filter-by-speciality"
            id="filter-by-speciality-select"
            label="speciality"
            uncontrolled="true"
            onChange={handleFilter}
          >
            {uniqueSpecialties.map((item) => {
              return <MenuItem value={item}>{item}</MenuItem>;
            })}
          </Select>
        </FormControl>
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
              <TableCell>{row.affiliation}</TableCell>
              <TableCell>{row.education}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.speciality}</TableCell>
              <TableCell>{row.hourlyRate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
