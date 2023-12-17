import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../userContest';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Grid, Typography, Card, CardActions, Button, CardContent } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DiscountIcon from '@mui/icons-material/Discount';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RedeemIcon from '@mui/icons-material/Redeem';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

const PatientAddPackage = () => {
  const [subscriptionType, setSubscriptionType] = useState('Yourself');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState('');
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [packageInfo, setPackageInfo] = useState({});
  const [subscriptionResult, setSubscriptionResult] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [myPackage, setMyPackage] = useState('');

  const { userId } = useUser();
  const navigate = useNavigate();
  let id = userId;
  // const id = "655089b786a7e9fff5d1d36a";

  useEffect(() => {
    // Fetch family members from MongoDB
    axios.get(`http://localhost:8000/patients/${id}`, { params: { id: id } })
      .then(response => {
        setFamilyMembers(response.data.familyMembers);
        setSelectedPatient(response.data);
  
        if (response.data.package) {
          axios.get(`http://localhost:8000/packages/${response.data.package}`, { params: { id: response.data.package } })
            .then(response => setMyPackage(response.data))
            .catch(error => console.error('Error fetching package details:', error));
        }
      })
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
    if (subscriptionType === 'Yourself' && selectedPackage) {
      axios.post(`http://localhost:8000/patients/${id}/packages/${selectedPackage}`, {
        params: { id: id, packageId: selectedPackage }
      })
        .then((res) => {
          navigate('/patient/pay/package', { state: { packageId: selectedPackage, famId: null } });
        })
        .catch((error) => {
          setSubscriptionResult('Error subscribing: ' + error.message);
        });
    } else if (subscriptionType === 'FamilyMember' && selectedPackage && selectedFamilyMember) {
      axios.post(`http://localhost:8000/patients/${id}/packages/${selectedFamilyMember}/${selectedPackage}`, {
        params: { id: id, pId: selectedFamilyMember, packageId: selectedPackage }
      })
        .then((res) => {
          navigate('/patient/pay/package', { state: { packageId: selectedPackage, famId: selectedFamilyMember } });
        })
        .catch((error) => {
          setSubscriptionResult('Error subscribing: ' + error.message);
        });
    }

    // window.location.reload();
  }

  const handleCancelling = () => {
    axios
      .delete(`http://localhost:8000/patients/${id}/packages`, {
        params: { id: id },
      })
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      });
  }

  return (

    <Container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '65vh' }}>

    <Grid item xs={12} md={4} >
      <Card elevation={5} sx={{ height: '30em', width: '18em', marginRight: '1em', marginLeft: '2em', borderRadius: '0.8em' }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Your Package
          </Typography>
          {myPackage ? (
            <>
          <Typography variant="body2" paragraph>
            <RedeemIcon></RedeemIcon> {myPackage.name} Package
          </Typography>
          <Typography variant="body2" paragraph>
            <AttachMoneyIcon></AttachMoneyIcon> {myPackage.price} EGP
          </Typography>
          <Typography variant="body2" paragraph>
            <DiscountIcon></DiscountIcon> {myPackage.discountOnDoctorSessions}% Discount on Doctor Sessions
          </Typography>
          <Typography variant="body2" paragraph>
            <DiscountIcon></DiscountIcon> {myPackage.discountOnMedicine}% Discount on Medicine
          </Typography>
          <Typography variant="body2" paragraph>
            <DiscountIcon></DiscountIcon> {myPackage.discountForFamily}% Discount for Family
          </Typography>
          {selectedPatient && selectedPatient.package && 
            selectedPatient.subscribedToPackage === true && 
            new Date(selectedPatient.packageRenewalDate).getTime() > Date.now() ? (
            <Typography variant="body2" paragraph>
              <CalendarMonthIcon></CalendarMonthIcon> Subscribed until {new Date(selectedPatient.packageRenewalDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </Typography>
          ) : ( selectedPatient && selectedPatient.package && 
            selectedPatient.subscribedToPackage === false && 
            new Date(selectedPatient.packageRenewalDate).getTime() > Date.now() ? (
            <Typography variant="body2" paragraph>
              <CalendarMonthIcon></CalendarMonthIcon> Subscription Cancelled With End Date {new Date(selectedPatient.packageRenewalDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </Typography>
          ) : (selectedPatient && (selectedPatient.package && 
            new Date(selectedPatient.packageRenewalDate).getTime() <= Date.now())
            || !selectedPatient.package ? (
            <Typography variant="body2" paragraph>
              <CalendarMonthIcon></CalendarMonthIcon> Not Subscribed
            </Typography>
          ) : null))}
          </>
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ margin: '7em 3em 7em 3em' }}>
              <CancelPresentationIcon /> No Package Available
            </Typography>
          )}
        </CardContent>
        <CardActions>
        {myPackage ? (
          selectedPatient && selectedPatient.package && 
          selectedPatient.subscribedToPackage === true && 
          new Date(selectedPatient.packageRenewalDate).getTime() > Date.now() ? (
            <Button variant="contained" color="error" onClick={() => handleCancelling()} fullWidth>
              Cancel Subscription
            </Button>
          ) : (
            <Button disabled fullWidth>
              Cancel Subscription
            </Button>
          )
        ) : (
          <Button disabled fullWidth>
            Not Subscribed
          </Button>
        )}
        </CardActions>
      </Card>
    </Grid>
    
    <Grid item xs={12} md={8} >
    <div className="d-grid vh-75 bg-white justify-content-center align-items-center p-5">
      <div className='d-grid justify-content-center align-items-center bg-blue border-5 border rounded p-3' style={{ height: '30em', width: '70em' }}>
        
        <Typography variant="h5" component="div">
          <CalendarMonthIcon></CalendarMonthIcon> Subscribe to a Package
        </Typography>
        
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
