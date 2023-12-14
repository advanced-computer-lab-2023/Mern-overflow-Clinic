import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import {  Typography } from '@mui/material';
import { Button } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../../userContest';
import { set } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const PatientViewPrescriptionDetails = ({ match }) => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const patientId = userId;
  let { id } = useParams();


  const [prescription, setPrescription] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

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
    
  }

  return (
    <div style={styles.container}>
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      
      <h2>Prescription Details</h2>
    <br></br>
      {/* <table style={styles.table}>
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
      </table> */}

<TableContainer component={Paper}>
      <Table>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Doctor</StyledTableCell>
            <StyledTableCell>Speciality</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Prescription Collected</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
            <StyledTableRow>
              <StyledTableCell>{prescription.doctor?.name}</StyledTableCell>
              <StyledTableCell>{prescription.doctor?.speciality}</StyledTableCell>            
              <StyledTableCell>{formatDate(prescription?.date)}</StyledTableCell>
              <StyledTableCell>{prescription.filled ? 'Collected' : 'Not Collected'}</StyledTableCell>
              </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>

      <br></br>

      <h4>Medicines Details</h4>

      {/* <table style={styles.table}>
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
      </table> */}

<TableContainer component={Paper}>
      <Table>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Dosage</StyledTableCell>
            <StyledTableCell>Medicinal Use</StyledTableCell>
            <StyledTableCell>Price</StyledTableCell>
            <StyledTableCell>Available Quantity</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {medicine.map((med, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{med?.name}</StyledTableCell>
              <StyledTableCell>{prescription.medicine[index]?.dailyDosage} {prescription.medicine[index]?.dailyDosage === 1 ? 'dosage' : 'dosages'} per day</StyledTableCell>
              <StyledTableCell>{med?.medicinalUse}</StyledTableCell>            
              <StyledTableCell>{med?.price}</StyledTableCell>
              <StyledTableCell>{med?.availableQuantity}</StyledTableCell>
              </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    
    <br></br>

      {!prescription.filled && (
            <Button variant="contained" onClick={handleButtonClick}>
              Collect Prescription
            </Button>
      )}

      <br></br>
      <br></br>
      <br></br>

      <button className="btn btn-primary"  onClick={() => handleClick(id)}>
                View Official Prescription Document
              </button>
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