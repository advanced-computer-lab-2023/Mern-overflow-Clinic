import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../userContest';
import { Typography, Card, CardContent, CardActions, Button, CardActionArea, Grid, Box } from '@mui/material';
import dayjs from 'dayjs'; // Make sure to import dayjs for date calculations
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const FamilyMemberCardView = () => {
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
    <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
      {familyMembers.map((member, index) => (
        <Card key={index} style={{ flex: '0 0 auto', width: '300px', margin: '10px' }}>
          <CardActionArea onClick={() => goToAppointments(member.patientId)}>
            <CardContent>
              <Typography variant="h6">
                {member.name}
              </Typography>
              <Typography>
                National ID: {member.nationalId}
              </Typography>
              <Typography>
                Gender: {member.gender}
              </Typography>
              <Typography>
                Relation: {member.relation}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              onClick={() => goToAppointments(member.patientId)}
              style={{ textTransform: 'none' }}
            >
              View Appointments
            </Button>
          </CardActions>
        </Card>
      ))}
    </div>
  );
};

export default FamilyMemberCardView;
