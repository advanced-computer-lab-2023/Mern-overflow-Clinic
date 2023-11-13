import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../userContest';

const PatientAddPackage = () => {
  const [subscriptionType, setSubscriptionType] = useState('Yourself');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState('');
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [packageInfo, setPackageInfo] = useState({});
  const [subscriptionResult, setSubscriptionResult] = useState('');

  const { userId } = useUser();
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
        console.log("selectedPackage is equal to: " + selectedPackage);
        console.log("selectedFamilyMember is equal to: " + selectedFamilyMember);
        // console.log("subscriptionType is equal to: " + subscriptionType);
        // console.log("packageId is equal to: " + selectedPackage._id);
        // console.log("familyMemberId is equal to: " + selectedFamilyMember._id);
        if (subscriptionType === 'Yourself' && selectedPackage) {
            console.log("subscriptionType1 is equal to: " + subscriptionType);
            axios.post(`http://localhost:8000/patients/${id}/packages/${selectedPackage}`, {
                params: { id: id, packageId: selectedPackage }
                })
                .then( (res) => {
                    setSubscriptionResult(res.data.message);
                })
                .catch( (error) => {
                    setSubscriptionResult('Error subscribing: ' + error.message);
                });
        } else if (subscriptionType === 'FamilyMember' && selectedPackage && selectedFamilyMember) {
            console.log("subscriptionType2 is equal to: " + subscriptionType);
            axios.post(`http://localhost:8000/patients/${id}/packages/${selectedFamilyMember}/${selectedPackage}`, {
                params: { id: id, pId: selectedFamilyMember, packageId: selectedPackage }
                })
                .then( (res) => {
                    setSubscriptionResult(res.data.message);
                })
                .catch( (error) => {
                    setSubscriptionResult('Error subscribing: ' + error.message);
                });
        }

        window.location.reload();
    }

  return (
    <div style={styles.container}>
      <div style={styles.row}>
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
        <div style={styles.row}>
          <label>Select Family Member:</label>
          <select value={selectedFamilyMember} onChange={handleFamilyMemberChange}>
            <option value="">Select</option>
            {familyMembers.map(member => (
              <option key={member._id} value={member.patientId}>{member.name}</option>
            ))}
          </select>
        </div>
      )}

      <div style={styles.row}>
        <label>Select Package:</label>
        <select value={selectedPackage} onChange={handlePackageChange}>
          <option value="">Select</option>
          {packages.map(pkg => (
            <option key={pkg._id} value={pkg._id}>{pkg.name}</option>
          ))}
        </select>
      </div>

      {selectedPackage && (
        <div style={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Attribute</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(packageInfo).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={styles.row}>
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
  );
};

const styles = {
  container: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    width: '300px',
    margin: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  row: {
    margin: '10px 0',
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
