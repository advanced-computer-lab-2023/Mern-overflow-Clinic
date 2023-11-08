import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import {  Typography } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css'



const PatientManageDocuments = () => {
    const id = "6529347d1b1e1b92fd454eff";
    const [data, setData] = useState([]);
    const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleFileUpload = async () => {
    const file = files[0];   
    const fileName = file.name;
    const filePath = URL.createObjectURL(file);
    const fileInfo = { filename: fileName, path: filePath };

    axios
      .post(`http://localhost:8000/patients/${id}/documents`, fileInfo)
      .then((response) => {
        console.log("PUT request successful", response);
        alert('file added successfuly ');
        window.location.reload();
      })
      .catch((error) => {
        console.log(JSON.stringify(fileInfo));
        console.error("Error making PUT request", error);
        alert('Error making POST request: ' + error.message);
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
        .catch(err => console.log(err))
    }


    return (
        
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className= 'w-50 bg-white rounded p-3'>
            <Typography variant="h5" sx={{ fontWeight: "normal", my: 2 }}>upload all required documents </Typography>
               
               
               <h1>File Upload</h1>
                <input type="file" onChange={handleFileChange} />
                <button className='btn btn-success' onClick={handleFileUpload}>Upload</button>
 
                <table className='table'>
                    <thead>
                        <tr>
                            <th>FileName</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((file) => {
                                return  <tr>
                                    <td>{file.filename}</td>
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

export default PatientManageDocuments;