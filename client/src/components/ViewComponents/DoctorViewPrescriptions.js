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
  import { styled } from '@mui/material/styles';
  import Table from '@mui/material/Table';
  import TableBody from '@mui/material/TableBody';
  import TableCell, { tableCellClasses } from '@mui/material/TableCell';
  import TableContainer from '@mui/material/TableContainer';
  import TableHead from '@mui/material/TableHead';
  import TableRow from '@mui/material/TableRow';
  import axios from "axios";
  import { useUser } from "../../userContest";
  import { useNavigate } from "react-router-dom";
  import { Link } from "react-router-dom";
  import { darken } from '@mui/system';

  
  export default function DoctorViewPrescriptions() {
    const [data, setData] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState({});
    const { userId } = useUser();
    // const id = "655089b786a7e9fff5d1d36a";
    const id = userId;
    const navigate = useNavigate();

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
      },
    }));
  
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        border: 0,
    }));
  
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
      navigate(`/doctor/prescriptions/${id}`);
    };
  
    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
      <Container maxWidth="xl">
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell key="patient">Patient</StyledTableCell>
              <StyledTableCell key="filled">Prescription Collected</StyledTableCell>
              <StyledTableCell key="date">Date</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((row) => (
                <StyledTableRow key={row.doctor?.name} onClick={() => handleClick(row._id)} style={{ cursor: 'pointer', transition: 'background-color 0.3s' }} hover>
                  <StyledTableCell>{row.patient?.name}</StyledTableCell>
                  <StyledTableCell>{row.filled.toString() == "true"? "Collected": "Not Collected"}</StyledTableCell>
                  <StyledTableCell>{formatDate(row.date)}</StyledTableCell>
                  {/* <TableCell>
                    {console.log("ID is: "+row._id)}
                    <Button onClick={() => handleClick(row._id)}>
                      Select Prescription
                    </Button>
                  </TableCell> */}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </Container>
    );
  }
  