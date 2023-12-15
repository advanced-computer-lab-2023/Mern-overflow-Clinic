import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import {  Typography } from '@mui/material';
import { Button } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../../userContest';
import { set } from 'react-hook-form';


const PatientViewPrescriptionDetails = ({ match }) => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const patientId = userId;
  let { id } = useParams();


  const [prescription, setPrescription] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchPrescription = async () => {
    try {
      console.log("PresID " + id);
      const response = await axios.get(`http://localhost:8000/prescriptions/${id}`);
  
      console.log("HI " + response.data);
      setPrescription(response.data);
  
      
        let medList = [];
  
        for (let i = 0; i < response.data.medicine.length; i++) {
          let mId = response.data.medicine[i].medId;
          console.log("Hello " + mId);
          const res = await axios.get(`http://localhost:8000/prescriptions/medicineDetails/${mId}`);
          medList.push(res.data);
        }  
        setMedicine(medList);
    } catch (error) {
      setErrorMessage("Error fetching prescription details");
      console.error("Error fetching prescription details:", error);
    }
  };

  useEffect(() => {
    fetchPrescription();
  }, [patientId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleClick = (pid) => {
    navigate(`/patient/prescriptions/${pid}/prescriptionDownload`);
  };

  const handleButtonClick = async () => {
    for(let i = 0; i < prescription.medicine.length; i++) {
      let medicine = await axios.get(`http://localhost:8000/prescriptions/medicineDetails/${prescription.medicine[i].medId}`);
      let medName = medicine.data.name;
      let medPrice = medicine.data.price;
      let medQuantity = prescription.medicine[i].quantity;
      let dataToServer = {
        medName,
        medPrice,
        medQuantity
      }
      await axios.post(`http://localhost:8000/prescriptions/${id}/addMedicineToCart`, dataToServer);

      navigate(`http://localhost:3001/patient/cart`);
    }
  }

  return (
    <div style={styles.container}>
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      
      <h2>Prescription Details</h2>
    <br></br>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Doctor</th>
            <th style={styles.th}>Specialty</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Prescription Collected</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>{prescription.doctor?.name}</td>
            <td style={styles.td}>{prescription.doctor?.speciality}</td>
            <td style={styles.td}>{formatDate(prescription?.date)}</td>
            <td style={styles.td}>{prescription.filled ? 'Collected' : 'Not Collected'}</td>
          </tr>
        </tbody>
      </table>

      <br></br>

      <h4>Medicines Details</h4>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Dosage</th>
            <th style={styles.th}>Medicinal Use</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Available Quantity</th>
          </tr>
        </thead>
        <tbody>
          {medicine.map((med, index) => (
            <tr key={index}>
              <td style={styles.td}>{med?.name}</td>
              <td style={styles.td}>{prescription.medicine[index]?.dailyDosage} {prescription.medicine[index]?.dailyDosage === 1 ? 'dosage' : 'dosages'} per day</td>  
              <td style={styles.td}>{med?.medicinalUse}</td>
              <td style={styles.td}>{med?.price}</td>
              <td style={styles.td}>{med?.availableQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!prescription.filled && (
            <Button variant="contained" onClick={handleButtonClick}>
              Collect Prescription
            </Button>
      )}

      <br></br>
      <br></br>
      <br></br>

      <Button variant="contained"  onClick={() => handleClick(id)}>
                View Official Prescription Document
        </Button>
    </div>
  );
};


const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: '20px',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    backgroundColor: '#f2f2f2',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #dddddd',
    padding: '8px',
    textAlign: 'left',
  },
};


export default PatientViewPrescriptionDetails;