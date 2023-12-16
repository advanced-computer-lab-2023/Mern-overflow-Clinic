import {
  Input,
  InputLabel,
  TextField,
  Grid,
  Select,
  MenuItem,
  Button,
  Box,
  Container,
  FormControl,
  Typography,
  Divider,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Dialog, 
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import {Snackbar,Alert} from '@mui/material';




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

const columns = [
  {
    key: "username",
    label: "USERNAME",
  },
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "email",
    label: "EMAIL",
  },
  {
    key: "dateOfBirth",
    label: "DATE OF BIRTH",
  },
  {
    key: "affiliation",
    label: "AFFILIATION",
  },
  {
    key: "education",
    label: "EDUCATION",
  },
  {
    key: "status",
    label: "STATUS",
  },
  {
    key: "speciality",
    label: "SPECIALITY",
  },
  {
    key: "hourlyrate",
    label: "HOURLY RATE",
  },
  {
    key: "files",
    label: "Documents",
  },
  {
    key: "action",
    label: "ACTION",
  },
  
];

export default function AdminViewDoctors() {
  const [data, setData] = useState([]);
  const [uniqueSpecialties, setUniqueSpecialties] = useState(["No filter"]);
  const [filteredData, setFilteredData] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTableData = () => {
    axios.get(`http://localhost:8000/doctors`)
      .then((res) => {
        let temp = ["No filter"];
        res.data.map((key) => {
          if (temp.indexOf(key.speciality) === -1) {
            temp.push(key.speciality);
          }
      });

        setUniqueSpecialties(temp);
      console.log("data IS : " + JSON.stringify(res.data));
        setData(res.data);
        setFilteredData(res.data);
      })
      .catch((error) => {
        console.error("Error getting Doctor data", error);
      });
  };

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

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    idToDelete: null,
  });

  const handleDeleteClick = (id) => {
    setDeleteConfirmation({
      open: true,
      idToDelete: id,
    });
  };

  const handleDeleteConfirm = () => {
    // Perform delete operation here
    handleDelete(deleteConfirmation.idToDelete);
    // Close the confirmation dialog
    setDeleteConfirmation({
      open: false,
      idToDelete: null,
    });
  };

  const handleDeleteCancel = () => {
    // Close the confirmation dialog without performing delete operation
    setDeleteConfirmation({
      open: false,
      idToDelete: null,
    });
  };

  const handleDelete = (id) => {
    console.log("Delete id: ", id);
    setSuccessOpen(true);
    setSuccessMessage("Doctor Deleted Successfully!");
    axios
      .delete(`http://localhost:8000/doctors/${id}`)
      .then((response) => {
         setSuccessOpen(true);
         setSuccessMessage("Doctor Deleted Successfully!");
        //console.log("DELETE request successful", response);
         fetchTableData();
       })
       .catch((error) => {
         setErrorOpen(true);
         setErrorMessage("Can't Delete!");   
         console.error("Error making DELETE request", error);
       });
  };

  useEffect(() => {
    fetchTableData();
  }, []);

 

  return (
    <div>
      {/* {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>} */}
      

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

    <TableContainer component={Paper} style={{ paddingTop: 50 }}>
          <Table>
            <TableHead>
              <StyledTableRow>
                {columns.map((column) => (
                  <StyledTableCell key={column.key} sx={{ fontWeight: 'bold' }}>{column.label}</StyledTableCell>
                ))}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <StyledTableRow key={row.username}>
                  <StyledTableCell>{row.username}</StyledTableCell>
                  <StyledTableCell>{row.name}</StyledTableCell>
                  <StyledTableCell>{row.email}</StyledTableCell>
                  <StyledTableCell>{row.dateOfBirth}</StyledTableCell>
                  <StyledTableCell>{row.affiliation}</StyledTableCell>
                  <StyledTableCell>{row.education}</StyledTableCell>
                  <StyledTableCell>{row.status}</StyledTableCell>
                  <StyledTableCell>{row.speciality}</StyledTableCell>
                  <StyledTableCell>{row.hourlyRate}</StyledTableCell>
                  <StyledTableCell>{
                    <ul>
                      {row.files.map((file, index) => (
                      <li key={index}>{file.filename}
                      <a href = {`http://localhost:8000/uploads/` + file.filename} target = "_blank">            View</a></li>
                      ))}
                    </ul>}
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton onClick={() => handleDeleteClick(row._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog open={deleteConfirmation.open} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} style={{ color: 'red' }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </TableContainer>
    </div>
  );
}



