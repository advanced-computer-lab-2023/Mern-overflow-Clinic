import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddFamilyMember from './AddFamilyMember';
import LinkFamilyMember from "./linkFamilyMembers";
import FamilyMemberTableView from '../ViewComponents/FamilyMemberTableView';
import { Container, Paper, Box } from '@mui/material';
import { useUser } from '../../userContest';

const FamilyMemberManagement = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const { userId } = useUser();

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = () => {
    axios.get(`http://localhost:8000/patients/${userId}/family`)
      .then(response => setFamilyMembers(response.data))
      .catch(error => console.error('Error fetching family members', error));
  };

  return (
    <Container maxWidth="lg">
      <LinkFamilyMember userId={userId} onMemberLinked={fetchFamilyMembers} />
      <AddFamilyMember userId={userId} onMemberAdded={fetchFamilyMembers} />
      <Box mb={4}> {/* Add margin at the bottom */}
        <FamilyMemberTableView />
      </Box>
    </Container>
  );
};

export default FamilyMemberManagement;
