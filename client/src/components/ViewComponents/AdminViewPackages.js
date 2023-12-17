import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Paper,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
  styled,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import {Snackbar,Alert} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminViewPackages(props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [Query, setQuery] = useState("");
  const [uniqueMedicinalUses, setUniqueMedicinalUses] = useState(["All"]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/packages`, {})
      .then((res) => {
        setData(res.data);
        props.setDataIsUpdated(true);
        let temp = ["All"];
        res.data.map((key) => {
          if (temp.indexOf(key.medicinalUse) === -1) {
            temp.push(key.medicinalUse);
          }
          return null;
        });
        setUniqueMedicinalUses(temp);
      })
      .catch((error) => {
        console.error("Error getting package data", error);
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

  useEffect(() => {
    fetchTableData();
  }, [props.dataIsUpdated]);

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
    handleClickDelete(deleteConfirmation.idToDelete);
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

  const handleClickDelete = (id) => {
    axios
      .delete(`http://localhost:8000/packages/${id}`)
      .then((response) => {
        console.log("DELETE request successful", response);
        setSuccessOpen(true);
        setSuccessMessage("package deleted Successfully!");
        fetchTableData();
      })
      .catch((error) => {
         setErrorOpen(true);
         setErrorMessage("can't delete!");
        console.error("Error making DELETE request", error);
      });
  };

  const handleClickEdit = (id) => {
    navigate(`/admin/packages/${id}`);
  };

  return (
    // <Container maxWidth="xl">
    //   <Paper elevation={3} sx={{ p: "20px", my: "40px", paddingBottom: 5 }}>
    
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell
                  key="name"
                  sx={{ fontWeight: "bold", borderTop: "1px solid #ccc" }}
                >
                  Name
                </StyledTableCell>
                <StyledTableCell
                  key="price"
                  sx={{ fontWeight: "bold", borderTop: "1px solid #ccc" }}
                >
                  Price
                </StyledTableCell>
                <StyledTableCell
                  key="discountOnDoctorSessions"
                  sx={{ fontWeight: "bold", borderTop: "1px solid #ccc" }}
                >
                  Discount On Doctor Sessions
                </StyledTableCell>
                <StyledTableCell
                  key="discountOnMedicine"
                  sx={{
                    fontWeight: "bold",
                    borderTop: "1px solid #ccc",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  Discount on Medicine
                </StyledTableCell>
                <StyledTableCell
                  key="discountForFamily"
                  sx={{
                    fontWeight: "bold",
                    borderTop: "1px solid #ccc",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  Discount For Family
                </StyledTableCell>
                <StyledTableCell
                  key="subscription"
                  sx={{
                    fontWeight: "bold",
                    borderTop: "1px solid #ccc",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  Subscription Period
                </StyledTableCell>
                <StyledTableCell
                  colSpan={2}
                  key="details"
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    borderTop: "1px solid #ccc",
                  }}
                >
                  Actions
                </StyledTableCell>
                {/* <TableCell key="details" sx={{ textAlign: 'center', fontWeight: "bold" }}>Edit</TableCell> */}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {data.map(
                (row) =>
                  row.name.toLowerCase().includes(Query.toLowerCase()) && (
                    <StyledTableRow key={row.username}>
                      <StyledTableCell>{row.name}</StyledTableCell>
                      <StyledTableCell>EGP {row.price}</StyledTableCell>
                      <StyledTableCell>{row.discountOnDoctorSessions}%</StyledTableCell>
                      <StyledTableCell>{row.discountOnMedicine}%</StyledTableCell>
                      <StyledTableCell>{row.discountForFamily}%</StyledTableCell>
                      <StyledTableCell>{row.subscriptionPeriod} days</StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        <IconButton onClick={() => handleClickEdit(row._id)}>
                          <EditIcon />
                        </IconButton>
                      </StyledTableCell>

                      <StyledTableCell sx={{ textAlign: "center" }}>
                        <IconButton onClick={() => handleDeleteClick(row._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ),
              )}
            </TableBody>
          </Table>

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
    //   </Paper>
    // </Container>
  );
}
