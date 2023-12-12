import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import {  Typography } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../../userContest';
import { useForm } from "react-hook-form";
import {
  Container,
  Paper,
  TextField,
  FormControl,
  Button,
  MenuItem,
  Select,
  InputLabel,
}from "@mui/material";
import { set } from 'react-hook-form';
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditIcon from "@mui/icons-material/Edit";
import {Snackbar,Alert} from '@mui/material';



const DoctorViewPrescriptionDetails = ({ match }) => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const {
    register,
    handleSubmit,
    reset, // <-- Add the reset function
    formState: { errors },
  } = useForm();
  const [statusMessage, setStatusMessage] = useState("");
  const doctorId = userId;
  let { id } = useParams();
   const [successOpen, setSuccessOpen] = useState(false);
   const [successMessage, setSuccessMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

   const [prescription, setPrescription] = useState([]);
   const [medicine, setMedicine] = useState([]);
   //const [errorMessage, setErrorMessage] = useState(null);
  

  const fetchPrescription = async () => {
    try {
      console.log("PresID " + id);
      const response = await axios.get(`http://localhost:8000/prescriptions/${id}`);
  
      console.log("HI " + response.data);
      setPrescription(response.data);
  
      
        let medList = [];
  
        for (let i = 0; i < response.data.medicine.length; i++) {
          let mId = response.data.medicine[i].medId;
          console.log("Hello! " + mId);
          const res = await axios.get(`http://localhost:8000/prescriptions/medicineDetails/${mId}`);
          console.log(res.data)
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
  }, [doctorId]);

   const handleSuccessClose = (event, reason) => {
     if (reason === "clickaway") {
       return;
     }
     setSuccessOpen(false);
   };
   const handleErrorClose = (event, reason) => {
     if (reason === "clickaway") {
       return;
     }
     setErrorOpen(false);
   };
  
 

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const onSubmit = (data) => {
    if(! (prescription.filled)){
    const requestData = {
      mName: data.medicineName,
      mDosage: data.dosage,
    };

    axios
      .post(`http://localhost:8000/prescriptions/${id}/addMedicine`, requestData)
      .then((response) => {
        setStatusMessage("medicine added successfully");
        console.log("POST request successful", response);

        // Reset the form after successful submission
        reset();
        window.location.reload();
        // Optionally, you can handle other actions after resetting the form
      })
      .catch((error) => {
        setStatusMessage("medicine not correct");
        console.error("Error making POST request", error);
      });
    }
    else{
      // setError(true);
      // setErrorMessage("prescription is already filled");
      setStatusMessage("prescription is filled!");
    }
  }

  const handleClickDelete = (mid) => {
    // const requestData = {
    //   mId: mid,
    // };
    if(!(prescription.filled)){
      axios
        .delete(`http://localhost:8000/prescriptions/${id}/deleteMedicine/${mid}`)
        .then((response) => {
          console.log("medicineId:  " + mid);
          console.log("DELETE request successful", response);
          // fetchTableData();
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error making DELETE request", error);
        });
    }
    else{
      setErrorOpen(true);
      setErrorMessage("prescription is filled!");
    }
  };

  const handleClickEdit = (mid) => {
    if(!(prescription.filled)){
    //console.log("medId! = " + mid);
    navigate(`/doctor/prescriptions/${id}/medicine/${mid}`);
    //console.log("medId! = " + mid);
    }
    else{
      setErrorOpen(true);
      setErrorMessage("prescription is filled!");
    }
  };

  const handleClick = (pid) => {
    navigate(`/doctor/prescriptions/${pid}/prescriptionDownload`);
  };

  return (
    <div style={styles.container}>
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      

       <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={handleSuccessClose}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleSuccessClose}
          severity="success"
        >
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorOpen}
        autoHideDuration={3000}
        onClose={handleErrorClose}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleErrorClose}
          severity="error"
        >
          {errorMessage}
        </Alert>
      </Snackbar> 


      {/* <h2>Prescription Details</h2>
    <br></br>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Doctor</th>
            <th style={styles.th}>Patient</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Filled</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>{prescription.doctor?.name}</td>
            <td style={styles.td}>{prescription.patient?.name}</td>
            <td style={styles.td}>{formatDate(prescription?.date)}</td>
            <td style={styles.td}>{prescription.filled ? 'Filled' : 'Not Filled'}</td>
          </tr>
        </tbody>
      </table> */}
      <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: "20px", my: "40px" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add Medicine
        </Typography>
        {statusMessage && (
          <Typography
            variant="body2"
            color={statusMessage.includes("Error") ? "error" : "success"}
            sx={{ mb: 2 }}
          >
            {statusMessage}
          </Typography>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Medicine Name"
            {...register("medicineName", { required: "medicine is required" })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Dosage"
            type="number"
            {...register("dosage", { required: "dosage is required" })}
            fullWidth
            sx={{ mb: 2 }}
          />
          {/* {errors.diagnosis && (
            <Typography color="error">{errors.diagnosis.message}</Typography>
          )} */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ p: 1.8, fontWeight: "bold", mb: 2 }}
          >
            Add Medicine
          </Button>
        </form>
      </Paper>
    </Container>

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
            <th style={styles.th}>Edit</th>
            <th style={styles.th}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {medicine.map((med, index) => (
            <tr key={index}>
              <td style={styles.td}>{med?.name}</td>
              <td style={styles.td}>{prescription.medicine[index]?.dailyDosage} {prescription.medicine[index]?.dailyDosage === 1 ? 'dosage' : 'dosages'} per day</td>  
              <td style={styles.td}>{med?.medicinalUse}</td>
              <td style={styles.td}>{med?.details.description}</td>
              <td style={styles.td}>{med?.details.activeIngredients.map((ingredient, i) => (
                <li key={i} style={styles.td}>{ingredient}</li>
              ))}</td>
              <td style={styles.td}>{med?.price}</td>
              <td style={styles.td}>{med?.availableQuantity}</td>
              <td style={styles.td}>{med?.overTheCounter ? 'Yes' : 'No' }</td>
              <td style={styles.td}>{med?.isArchived ? 'Yes' : 'No' }</td>
              <td style={styles.td}>
                        <IconButton onClick={() => handleClickEdit(med?._id)}>
                          <EditIcon />
                        </IconButton>
                      </td>
              <td style={styles.td}>
                        <IconButton onClick={() => handleClickDelete(med?._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary"  onClick={() => handleClick(id)}>
                View Official Prescription Document
              </button>
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

export default DoctorViewPrescriptionDetails;