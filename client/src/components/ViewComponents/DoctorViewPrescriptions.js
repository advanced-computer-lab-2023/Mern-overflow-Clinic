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
  import { useUser } from "../../userContest";
  import { useNavigate } from "react-router-dom";
  import { Link } from "react-router-dom";
  
  export default function DoctorViewPrescriptions() {
    const [data, setData] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState({});
    const { userId } = useUser();
    // const id = "655089b786a7e9fff5d1d36a";
    const id = userId;
    const navigate = useNavigate();
  
    const fetchTableData = () => {
      axios
        .get(`http://localhost:8000/doctors/${id}/prescriptions`, {
          params: { id: id },
        })
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => {
          console.error("Error getting Doctor data", error);
        });
    };
  
    useEffect(() => {
      fetchTableData();
    }, []);
  
    const handleClick = (id) => {
    //   navigate(`/doctor/prescriptions/${id}`);
    };
  
    return (
      <Container maxWidth="xl">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell key="doctor">Doctor</TableCell>
              <TableCell key="patient">Patient</TableCell>
              <TableCell key="filled">Filled</TableCell>
              <TableCell key="date">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((row) => (
                <TableRow key={row.patient?.name}>
                  <TableCell>{row.doctor?.name}</TableCell>
                  <TableCell>{row.patient?.name}</TableCell>
                  <TableCell>{row.filled.toString()}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    {console.log("ID is: "+row._id)}
                    <Button onClick={() => handleClick(row._id)}>
                      Select Prescription
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Container>
    );
  }
  