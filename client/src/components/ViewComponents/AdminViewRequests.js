import { Input, InputLabel, TextField, Grid, Select, MenuItem, Button, Box, Container, FormControl, Typography, Divider, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from '@mui/material/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

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
  {
    key: "action",
    label: "ACTION",
  },
];

export default function AdminViewDoctors() {
  const [data, setData] = useState([]);
  const [uniqueSpecialties, setUniqueSpecialties] = useState(["No filter"]);
  const [filteredData, setFilteredData] = useState([]);

  const fetchTableData = () => {
    axios.get(`http://localhost:8000/admins/requests`).then((res) => {
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


  const handleAccept = (id) => {
    axios.post(`http://localhost:8000/admins/acceptDoctorRequest`,{id:id})
      .then((response) => {
        console.log('POST request successful', response);
        fetchTableData();
      })
      .catch((error) => {
        console.error('Error making POST request', error);
      });
  }

  const handleReject= (id) => {
    axios.post(`http://localhost:8000/admins/rejectDoctorRequest`,{id:id})
      .then((response) => {
        console.log('POST request successful', response);
        fetchTableData();
      })
      .catch((error) => {
        console.error('Error making POST request', error);
      });
  }

  useEffect(() => {
    fetchTableData();
  }, []);


  return (
    <Container maxWidth="xl">
      <Paper elevation={3} sx={{ my: '40px', paddingBottom: 5, maxHeight: '500px', overflow: 'auto' }}>
          <Container>

          <Table >
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
                  <TableCell>
                    <IconButton onClick={() => handleAccept(row._id)}>
                      <DoneIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleReject(row._id)}>
                      <ClearIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
      </Paper>
    </Container>

  );
}
