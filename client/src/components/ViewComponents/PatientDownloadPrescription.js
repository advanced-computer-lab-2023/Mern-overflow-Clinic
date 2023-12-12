import React, {useState, useEffect, useRef} from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../../userContest';
import { useForm } from "react-hook-form";

export default function PDF() {
    const pdfRef = useRef();
    const navigate = useNavigate();
    const { userId } = useUser();
    const {
      register,
      handleSubmit,
      reset, // <-- Add the reset function
      formState: { errors },
    } = useForm();
    const [statusMessage, setStatusMessage] = useState("");
    const patientId = userId;
    let { id } = useParams();
     const [successOpen, setSuccessOpen] = useState(false);
     const [successMessage, setSuccessMessage] = useState("");
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
  
     const [prescription, setPrescription] = useState([]);
     const [medicine, setMedicine] = useState([]);

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
      }, [patientId]);

    const downloadPDF = () => {
        const input = pdfRef.current;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p','mm','a4',true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 30;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save("prescription.pdf");
        });
    };

    // return (
    //     <>
    //      <div className="container mt-5 border p-5" ref={pdfRef}>
    //         <div className="row mb-4">
    //             <div className="col-6">
    //                 {/* <img src={require('../react.png')} alt="logo" width="100" />     */}
    //             </div>
    //             <div className="col-6 text-end">
    //                 <h5>Prescription</h5>
    //             </div>
    //         </div>
    //        </div> 
    //        <div className='row text-center mt-5'>
    //             <div className="col">
    //                 <button className="btn btn-primary" onClick={downloadPDF}>Download PDF</button>
    //             </div>
    //         </div>    
    //    </>
    // )
    return (
        <>
          <div className="container mt-5 border p-5" ref={pdfRef}>
            <div className="row mb-5">
              <div className="col-3">
                {/* Your logo or any other content */}
                  {/* <img src={'http://localhost:8000/uploads/162406-landscape-mountain-lake-snow-ice.jpg'} alt="logo" width="150" height='150' />   */}
                  <img src={require('../../assets/photos/prescriptionLogo.png')} alt="logo" width="200" height="200" />   
              </div>
              <div className="col-9 text-end">
                <h5>PRESCRIPTION</h5>
              </div>
            </div>
    
            <div className="col-2 text-end">
                <h5>Doctor Name: {prescription.doctor?.name}</h5>
                <h5>Patient Name: {prescription.patient?.name}</h5>
            </div>

        
    
            <br></br>

      <h4>Medicines Details</h4>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Dosage</th>
            <th style={styles.th}>Medicinal Use</th>
            <th style={styles.th}>Price</th>
          </tr>
        </thead>
        <tbody>
          {medicine.map((med, index) => (
            <tr key={index}>
              <td style={styles.td}>{med?.name}</td>
              <td style={styles.td}>{prescription.medicine[index]?.dailyDosage} {prescription.medicine[index]?.dailyDosage === 1 ? 'dosage' : 'dosages'} per day</td>  
              <td style={styles.td}>{med?.medicinalUse}</td>
              <td style={styles.td}>{med?.price}</td>
              </tr>
          ))}
        </tbody>
      </table>
    
            {/* Add more sections and details as needed */}
          </div>
    
          <div className="row text-center mt-5">
            <div className="col">
              <button className="btn btn-primary" onClick={downloadPDF}>
                Download PDF
              </button>
            </div>
          </div>
        </>
      );

      
}

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