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

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "affiliation",
    label: "AFFILIATION",
  },
  {
    key: "hourlyrate",
    label: "HOURLY RATE",
  },

  {
    key: "status",
    label: "STATUS",
  },
];

const rows = [
  {
    username: "a",
    name: "Ahmed Alkhadem",
    affiliation: "Dentist",
    hourlyRate: "10$",
    status: "Available",
  },

  {
    username: "b",
    name: "Ahmed El Akkad",
    affiliation: "Dentist",
    hourlyRate: "10$",
    status: "Available",
  },

  {
    username: "c",
    name: "Adel El Etreby",
    affiliation: "Cardiology",
    hourlyRate: "100$",
    status: "Pending",
  },

  {
    username: "d",
    name: "Ahmed Ragab",
    affiliation: "Cardiology",
    hourlyRate: "50$",
    status: "Available",
  },
];

export default function PatientView(props) {
  const [searchData, setSearchData] = useState(rows);
  const [filterSpecialty, setfilterSpecialty] = useState("No filter");
  const uniqueSpecialties = ["No filter"];
  rows.map((key) => {
    if (uniqueSpecialties.indexOf(key.status) === -1) {
      uniqueSpecialties.push(key.status);
    }
  });
  const handleFilter = (e) => {
    e.preventDefault();
    setfilterSpecialty(e.target.value);
  };

  const searchItem = (query) => {
    if (!query) {
      setSearchData(rows);
      return;
    }
    const fuse = new Fuse(rows, {
      keys: ["name"],
      threshold: 0.3,
    });
    const result = fuse.search(query);
    const finalResult = [];
    if (result.length) {
      result.forEach((item) => {
        finalResult.push(item.item);
      });
      setSearchData(finalResult);
    } else {
      setSearchData([]);
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
          <InputLabel id="filter-by-specialty">Specialty</InputLabel>
          <Select
            labelId="filter-by-specialty"
            id="filter-by-specialty-select"
            value={filterSpecialty}
            label="specialty"
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
          {searchData.map(
            (row) =>
              (filterSpecialty === "No filter" ||
                filterSpecialty === row.affiliation) && (
                <TableRow key={row.key}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.affiliation}</TableCell>
                  <TableCell>{row.hourlyRate}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ),
          )}
        </TableBody>
      </Table>
    </Container>
  );
}
