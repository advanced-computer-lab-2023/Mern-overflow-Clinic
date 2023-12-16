import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../userContest';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import dayjs from 'dayjs'; // Make sure to import dayjs for date calculations
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const FamilyMemberTableView = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const { userId } = useUser();
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = () => {
    axios.get(`http://localhost:8000/patients/${userId}/family`)
      .then(response => setFamilyMembers(response.data))
      .catch(error => console.error('Error fetching family members', error));
  };

  // Utility function to calculate age from dateOfBirth
  const calculateAge = (dateOfBirth) => {
    return dayjs().diff(dayjs(dateOfBirth), 'year');
  };
  const goToAppointments = (memberId) => {
    navigate(`/patient/family/appointments/${memberId}`); 
  };
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ mt: 4, mb: 2}}> {/* Added margin top */}
        My Family Members
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>National ID</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Relation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {familyMembers.map((member, index) => (
            <TableRow key={index}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.nationalId}</TableCell>
              <TableCell>{member.gender}</TableCell>
              <TableCell>{member.relation}</TableCell>
           
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => goToAppointments(member.patientId)}
                >
                  View Appointments
                </Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FamilyMemberTableView;
