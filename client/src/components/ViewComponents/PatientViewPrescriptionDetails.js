import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import {  Typography } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../../userContest';
import { set } from 'react-hook-form';


const PatientViewPrescriptionDetails = ({ match }) => {
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
  


  // const fetchMedicine = async () => {
  //   try {
  //   let medList = [];
  //   for(let i=0;i<prescription.medicines.length;i++){
  //         let medId = prescription.medicines[i];
  //         const response = await axios.get(`http://localhost:8000/precriptions/medicineDetails` , {mId: medId} );
  //         medList.push(response.data);
  //       }     
  //       setMedicine(medList);
  //     }
  //     catch (error) {
  //       setErrorMessage("Error fetching medicine details");
  //       console.error("Error fetching medicine details:", error);
  //     }
  //   };

  useEffect(() => {
    fetchPrescription();
  }, [patientId]);

  // useEffect(() => {
  //   fetchMedicine();
  // }, [patientId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={styles.container}>
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      
      <h2>Prescription Details</h2>
    <br></br>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Patient</th>
            <th style={styles.th}>Doctor</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Filled</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>{prescription.patient?.name}</td>
            <td style={styles.td}>{prescription.doctor?.name}</td>
            <td style={styles.td}>{formatDate(prescription?.date)}</td>
            <td style={styles.td}>{prescription.filled ? 'Filled' : 'Not Filled'}</td>
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
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Active Ingredients</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Available Quantity</th>
            <th style={styles.th}>Over The Counter</th>
            <th style={styles.th}>Archived</th>
          </tr>
        </thead>
        <tbody>
          {medicine.map((med, index) => (
            <tr key={index}>
              <td style={styles.td}>{med?.name}</td>
              <td style={styles.td}>{prescription.medicine[index]?.dailyDosage} {prescription.medicine[index]?.dailyDosage === 1 ? 'dosage' : 'dosages'} per day</td>  
              <td style={styles.td}>{med?.medicinalUse}</td>
              <td style={styles.td}>{med?.details.description}</td>
              {med?.details.activeIngredients.map((ingredient, i) => (
                <li key={i} style={styles.td}>{ingredient}</li>
              ))}
              <td style={styles.td}>{med?.price}</td>
              <td style={styles.td}>{med?.availableQuantity}</td>
              <td style={styles.td}>{med?.overTheCounter ? 'Yes' : 'No' }</td>
              <td style={styles.td}>{med?.isArchived ? 'Yes' : 'No' }</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

// {/* <td style={styles.td}>
// <ul>
//   {medicine.map((med, index) => (
//     <ul key={index} style={styles.td}>
//       {/* Your medicine details here */}
//     </ul>
//   ))}
// </ul>
// </td> */}

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

// const styles = {
//   container: {
//     textAlign: "center",
//     margin: "20px",
//   },
//   header: {
//     fontSize: "1.5rem",
//   },
//   healthRecordsTable: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   recordRow: {
//     borderTop: "15px solid transparent",
//   },
//   errorMessage: {
//     backgroundColor: "lightcoral",
//     padding: "1rem",
//     margin: "1rem",
//   },
// };

export default PatientViewPrescriptionDetails;