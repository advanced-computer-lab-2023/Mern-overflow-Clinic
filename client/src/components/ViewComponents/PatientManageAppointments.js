
//   }
  
import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "axios";

const PatientBookAppointment = ({ doctorId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchTableData = () => {
      axios
        .get(`http://localhost:8000/doctors/${doctorId}`)
        .then((res) => {
          setData(res.data);
          console.log(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchTableData();
  }, [doctorId]);

  if (!data) {
    // Loading state, you can show a loader here
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="xl">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient Name</TableCell>
            <TableCell>National ID</TableCell>
            <TableCell>BirthDate</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell>Wallet Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{data.name}</TableCell>
            <TableCell>{data.nationalId}</TableCell>
            <TableCell>
              {new Date(data.dateOfBirth).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </TableCell>
            <TableCell>{data.gender}</TableCell>
            <TableCell>{data.mobileNumber}</TableCell>
            <TableCell>{data.wallet}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Container>
  );
};

export default PatientBookAppointment;
