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

// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { useUser } from "../../userContest";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function PatientViewFamilyMembers() {
  const [data, setData] = useState([]);
  const { userId } = useUser();
  const navigate = useNavigate();

  // const id = "655089b786a7e9fff5d1d36a";
  const id = userId;
  console.log(id);

  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/patients/${id}/family`, {
        params: { id: id },
      })
      .then((res) => {
        //console.log(res.data);
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error getting Doctor data", error);
      });
  };

  useEffect(() => {
    fetchTableData();
  }, []);
  

  const handleSelectFamily = (ID) => {
    // Example action: console log the selected row data
    const doctorDetailsURL = `/patient/family/appointments`;
    // Add the 'id' parameter to the URL
    const doctorDetailsURLWithId = `${doctorDetailsURL}/${ID}`;
    
    // Navigate to the doctor details page with the 'id' parameter
    navigate(doctorDetailsURLWithId);
  };
  
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
              <TableCell>
                  <Button onClick={() => handleSelectFamily(row)}>
                    
                    View Appointments
                  </Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
