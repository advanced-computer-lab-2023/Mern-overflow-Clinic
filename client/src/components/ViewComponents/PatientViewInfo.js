import { Container } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUser } from "../../userContest";

export default function PatientViewInfo() {
  const [data, setData] = useState([]);

  //    const id = "6529347d1b1e1b92fd454eff";

  const { userId } = useUser();
  let id = userId;
  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/patients/${id}`)
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
}

