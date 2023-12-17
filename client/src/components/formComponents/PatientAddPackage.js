import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../userContest';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Grid, Typography, Card, CardActions, Button, CardContent } from '@mui/material';

const PatientAddPackage = () => {
  const [subscriptionType, setSubscriptionType] = useState('Yourself');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState('');
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [packageInfo, setPackageInfo] = useState({});
  const [subscriptionResult, setSubscriptionResult] = useState('');

  const { userId } = useUser();
  const navigate = useNavigate();
  let id = userId;
  // const id = "655089b786a7e9fff5d1d36a";

  useEffect(() => {
    // Fetch family members from MongoDB
    axios.get(`http://localhost:8000/patients/${id}`, { params: { id: id } })
      .then(response => setFamilyMembers(response.data.familyMembers))
      .catch(error => console.error('Error fetching family members:', error));

    // Fetch packages from MongoDB
    axios.get('http://localhost:8000/packages')
      .then(response => setPackages(response.data))
      .catch(error => console.error('Error fetching packages:', error));
  }, []);

  const handleSubscriptionTypeChange = (event) => {
    setSubscriptionType(event.target.value);
    setSelectedFamilyMember(''); // Reset selected family member when switching subscription type
  };

  const handleFamilyMemberChange = (event) => {
    setSelectedFamilyMember(event.target.value);
  };

  const handlePackageChange = (event) => {
    setSelectedPackage(event.target.value);

    // Fetch package info based on the selected package
    const selectedPackageInfo = packages.find(pkg => pkg._id === event.target.value);
    setPackageInfo(selectedPackageInfo || {});
  };

  const handleSubscribe = () => {
    // Perform the subscription logic using axios.post
    // Include the necessary data like selectedFamilyMember, selectedPackage, etc.
    // Update the subscriptionResult state based on the result of the post request
    // Example:
    // console.log("selectedPackage is equal to: " + selectedPackage);
    // console.log("selectedFamilyMember is equal to: " + selectedFamilyMember);
    // console.log("subscriptionType is equal to: " + subscriptionType);
    // console.log("packageId is equal to: " + selectedPackage._id);
    // console.log("familyMemberId is equal to: " + selectedFamilyMember._id);
    if (subscriptionType === 'Yourself' && selectedPackage) {
      // console.log("subscriptionType1 is equal to: " + subscriptionType);
      axios.post(`http://localhost:8000/patients/${id}/packages/${selectedPackage}`, {
        params: { id: id, packageId: selectedPackage }
      })
        .then((res) => {
          // setSubscriptionResult(res.data.message);
          navigate('/patient/pay/package', { state: { packageId: selectedPackage, famId: null } });
        })
        .catch((error) => {
          setSubscriptionResult('Error subscribing: ' + error.message);
        });
    } else if (subscriptionType === 'FamilyMember' && selectedPackage && selectedFamilyMember) {
      // console.log("subscriptionType2 is equal to: " + subscriptionType);
      axios.post(`http://localhost:8000/patients/${id}/packages/${selectedFamilyMember}/${selectedPackage}`, {
        params: { id: id, pId: selectedFamilyMember, packageId: selectedPackage }
      })
        .then((res) => {
          // setSubscriptionResult(res.data.message);
          navigate('/patient/pay/package', { state: { packageId: selectedPackage, famId: selectedFamilyMember } });
        })
        .catch((error) => {
          setSubscriptionResult('Error subscribing: ' + error.message);
        });
    }

    // window.location.reload();
  }

  return (

    <Container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>

    <Grid item xs={12} md={4} >
      <Card elevation={5} sx={{ height: '21em', width: '17em', marginRight: '1em', marginLeft: '2em', borderRadius: '0.8em' }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Your Package
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Grid>
    
    <Grid item xs={12} md={8} >
    <div className="d-grid vh-75 bg-white justify-content-center align-items-center p-5">
      <div className='d-grid justify-content-center align-items-center bg-blue border-5 border rounded p-3' style={{ height: '21em', width: '70em' }}>
        <div style={styles.row} className='d-grid align-items-center justify-content-center'>
          <label>
            <input
              type="radio"
              value="Yourself"
              checked={subscriptionType === 'Yourself'}
              onChange={handleSubscriptionTypeChange}
            />
            Yourself
          </label>
          <label>
            <input
              type="radio"
              value="FamilyMember"
              checked={subscriptionType === 'FamilyMember'}
              onChange={handleSubscriptionTypeChange}
            />
            A Family Member
          </label>
        </div>

        {subscriptionType === 'FamilyMember' && (
          <div style={styles.row} className='d-grid align-items-center justify-content-center'>
            <label>Select Family Member:</label>
            <select value={selectedFamilyMember} onChange={handleFamilyMemberChange}>
              <option value="">Select</option>
              {familyMembers.map(member => (
                <option key={member._id} value={member.patientId}>{member.name}</option>
              ))}
            </select>
          </div>
        )}

        <div style={styles.row} className='d-grid align-items-center justify-content-center'>
          <label>Select Package:</label>
          <select value={selectedPackage} onChange={handlePackageChange}>
            <option value="">Select</option>
            {packages.map(pkg => (
              <option key={pkg._id} value={pkg._id}>{pkg.name}</option>
            ))}
          </select>
        </div>

        <div style={{ ...styles.table, width: '70em', marginLeft: '5em' }}>
          {selectedPackage && (
            <table>
              <thead className=' p-3 border bg-light'>
                <tr>
                  <th className='px-3'>Package Name</th>
                  <th className='px-3'>Price</th>
                  <th className='px-3'>Discount On Doctor Sessions</th>
                  <th className='px-3'>Discount On Medicine</th>
                  <th className='px-3'>Discount For Family</th>
                  <th className='px-3'>Subscription Period</th>
                </tr>
              </thead>
              <tbody>
                {console.log("packageInfo is equal to: " + JSON.stringify(packageInfo))}
                <tr key={packageInfo.name + packageInfo.price}>
                  <td className='px-3'>{packageInfo.name}</td>
                  <td className='px-3'>EGP {packageInfo.price}</td>
                  <td className='px-3'>{packageInfo.discountOnDoctorSessions}%</td>
                  <td className='px-3'>{packageInfo.discountOnMedicine}%</td>
                  <td className='px-3'>{packageInfo.discountForFamily}%</td>
                  <td className='px-3'>{packageInfo.subscriptionPeriod} days</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div style={styles.row} className='d-grid align-items-center justify-content-center'>
          <button onClick={handleSubscribe} style={styles.button}>
            Subscribe
          </button>
        </div>

        {subscriptionResult && (
          <div style={styles.result}>
            <p>{subscriptionResult}</p>
          </div>
        )}
      </div>
    </div>
    </Grid>
    </Container>
  );
};

const styles = {

  // body: {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   height: '100vh'
  // },
  container: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    width: '1000px',
    margin: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'grid',
    justifyContent: 'center', /* Horizontal centering */
    alignItems: 'center'
  },
  row: {
    margin: '10px 0',
    display: 'grid',
    justifyContent: 'space-between', // Use 'space-between'
  },
  table: {
    margin: '20px 0',
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#007BFF',
    color: '#fff',
    outline: 'none',
  },
  result: {
    marginTop: '20px',
  },
};

export default PatientAddPackage;
