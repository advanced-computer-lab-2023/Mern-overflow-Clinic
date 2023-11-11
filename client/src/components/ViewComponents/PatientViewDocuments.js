import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import {  Typography } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { Worker, Viewer } from 'react-pdf-viewer/core';
//import 'react-pdf-viewer/core/lib/styles/index.css';
//import { Document, Page, pdfjs } from 'react-pdf';



const PatientViewDocuments = () => {
    const id = "6529347d1b1e1b92fd454eff";
    const [data, setData] = useState([]);
    const [file, setFile] = useState([]);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
     //setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    //  const files = file;   
    //  const fileName = files.name;
    //  const filePath = URL.createObjectURL(files);
    //  const fileInfo = { filename: fileName, path: filePath };
    if (file.length === 0) return alert("Please select a file to upload");
    const formData = new FormData();
    console.log("file is equal to: " + JSON.stringify(file));
    formData.append('file', file);
    console.log("formData is equal to: " + JSON.stringify(formData));

    axios
      .post(`http://localhost:8000/patients/${id}/documents`, formData)
      .then((response) => {
        console.log("PUT request successful", response);
        window.location.reload();
      })
      .catch((error) => {
        console.log(JSON.stringify(formData));
        if (error.response && error.response.status === 400 && error.response.data.message === "Filename already exists in the patient's files") {
          alert(error.response.data.message);
        }
        else{
          console.error("Error making PUT request", error);
          alert('Error making POST request: ' + error.message);
        }
      });
  };

    const fetchTableData = () => {
        axios
          .get(`http://localhost:8000/patients/${id}/documents`, {
            params: { id: id },
          })
          .then((res) => {
            console.log(res.data);
            setData(res.data);
            console.log("data retrieved is: " + JSON.stringify(res.data))
          });
      };

      useEffect(() => {
        fetchTableData();
      }, []);

      const handleDelete = (filename) => {
        axios.delete(`http://localhost:8000/patients/${id}/documents`, { data: { filename: filename } })
        .then(res => {console.log(res)
            console.log("fileName is equal to: " + filename);
            window.location.reload()})
            .catch(err => {
              console.log(err);
          });
    }

     function openPDF(e, filename) {
          e.preventDefault();
          console.log("filename is equal to: " + filename);
          // axios.get(`http://localhost:8000/uploads/` + filename)
          // .then(res => {            
          //   console.log("fileName is equal to: " + filename);
          //   console.log("res.data is equal to: " + res.data);
          //   console.log("res.data.path is equal to: " + res.data.path);
          //   window.open(res.data, '_blank');
          //   //window.location.reload();
          // })
          // .catch(err => console.log(err))         
          const path = `http://localhost:8000/uploads/` + filename;
          window.open(path, '_blank');        
     }
    

    // function openPDF(e,path) {
      
    
    //   const pdfPath = path;
    
    //   pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    
    //   const onDocumentLoadSuccess = ({ numPages }) => {
    //     setNumPages(numPages);
    //   };
    
    //   return (
    //     <div>
    //       <Document file={pdfPath} onLoadSuccess={onDocumentLoadSuccess}>
    //         <Page pageNumber={pageNumber} />
    //       </Document>
    //       <p>
    //         Page {pageNumber} of {numPages}
    //       </p>
    //     </div>
    //   );
    // };


    return (
        
        <div className="d-flex vh-100 bg-white justify-content-center align-items-center">
            <div className= 'w-50 bg-blue border-5 border rounded p-3'>
            <Typography variant="h5" sx={{ fontWeight: "normal", my: 2 }}>upload all required documents </Typography>
               
               
               <h1>File Upload</h1>
                <input type="file" onChange={handleFileChange} />
                <button className='btn btn-success' onClick={handleFileUpload}>Upload</button>
 
                <table className='table'>
                    <thead>
                        <tr>
                            <th>FileName</th>
                            <th>View document</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((file) => {
                                return  <tr>
                                    <td>{file.filename}</td>
                                    <td>
                                        { <button className='btn btn-primary'
                                        onClick={(e) => openPDF(e, file.filename)}>View</button> }
                                        {/* //<a href = {file.path} target = "_blank">View</a> */}
                                    </td>
                                    <td>
                                        <button className='btn btn-danger'
                                        onClick={(e) => handleDelete(file.filename)}>Delete</button>
                                    </td>
                                </tr>
                            })
                        }

                    </tbody>
                </table>
            </div>
        </div>       
    )


};

export default PatientViewDocuments;