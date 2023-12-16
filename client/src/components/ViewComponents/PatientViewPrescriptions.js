import {
  Input,
  Container,
  Button,
  List,
  ListItem,
  Paper,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  Grid,
} from "@mui/material";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MedicationIcon from '@mui/icons-material/Medication';
import { useTheme } from '@mui/material/styles';
import axios from "axios";
import { useUser } from "../../userContest";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function PatientViewPrescriptions() {
  const [data, setData] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState({});
  const { userId } = useUser();
  const theme = useTheme();
  // const id = "655089b786a7e9fff5d1d36a";
  const id = userId;
  const navigate = useNavigate();

  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/patients/${id}/prescriptions`, {
        params: { id: id },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error getting Doctor data", error);
      });
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    let doctor = e.target[0].value;
    let filled = e.target[1].value;
    let date = e.target[3].value;

    axios
      .post(`http://localhost:8000/patients/${id}/prescriptionsFilter`, {
        doctorName: doctor,
        date: date,
        filled: filled === "filled" ? "true" : "false",
      })
      .then((res) => {
        setData(res.data);
      })
      .catch(() => setData([]));
  };

  const handleClick = (id) => {
    navigate(`/patient/prescriptions/${id}`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (

    <Container sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      <Grid container spacing={10} sx={{ width: '100%' }}>
        {/* Left third of the page */}
        <Grid item xs={12} md={4} sx={{ width: '100%' }}>
          <Card justifyContent="center" alignItems="center" elevation={5} sx={{ maxWidth: 500, width: '150%', height: '70vh', margin: '5em 0em 5em -7.5em', borderRadius: '0.8em', position: 'fixed' }}>
            <CardContent>
              <Container sx={{ width: "100%", display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '3em', marginTop: '0.5em' }}>
                  Filter Prescriptions
                </Typography>
                <form onSubmit={handleFilter}>
                  <FormControl fullWidth sx={{ padding: '1em' }}>
                    <InputLabel id="doctor">Doctor Name</InputLabel>
                    <Input placeholder="Search..." />
                  </FormControl>
                  <FormControl fullWidth sx={{ padding: '1em' }}>
                    <InputLabel id="filter-by-filled"></InputLabel>
                    <Select
                      labelId="filter-by-filled"
                      id="filter-by-filled"
                      label="filled"
                      defaultValue="filled"
                      uncontrolled="true"
                      fullWidth
                    >
                      <MenuItem value="filled">Collected</MenuItem>
                      <MenuItem value="unfilled">Not Collected</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ padding: '1em' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        slotProps={{
                          actionBar: {
                            actions: ["clear"],
                          },
                        }}
                      ></DateTimePicker>
                    </LocalizationProvider>
                  </FormControl>

                  <FormControl fullWidth>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      sx={{ mt: 3, mb: 2, p: 2, fontWeight: "bold" }}
                    >
                      Filter
                    </Button>
                  </FormControl>
                </form>

              </Container>

            </CardContent>
            <CardActions sx={{ alignItems: 'center', justifyContent: 'center' }}>
              <Button
                fullWidth
                type="submit"
                variant="outlined"
                onClick={fetchTableData}
                sx={{ mt: 3, mb: 2, p: 2, fontWeight: "bold", width: '85%', alignItems: 'center', justifyContent: 'center' }}
              >
                Clear
              </Button>
            </CardActions>
          </Card>

        </Grid>
        {/* Right two thirds of the page */}
        <Grid item xs={12} md={8} >
          <Container elevation={5} sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', 
                                          margin: '5em -7.5em 5em 5em', width: '125%', position: 'sticky', maxHeight: '70vh',
                                          overflow: 'auto', border: '1px solid #ccc', borderRadius: '0.8em',
                                          '::-webkit-scrollbar': {width: '12px'}, '::-webkit-scrollbar-thumb': {backgroundColor: '#888', borderRadius: '6px'},
                                          '::-webkit-scrollbar-track': {backgroundColor: '#eee', borderRadius: '8px'} }}>
            {
              data && data.map((row) => (
                <Card key={row._id} elevation={5} sx={{ maxWidth: 1000, margin: '2em -3em 2em 0em', width: '75%', borderRadius: '0.8em', transition: 'background-color 0.1s ease-in-out', 
                '&:hover': {
                  backgroundColor: '#e0e0e0', // Change the text color on hover
                }, }}>
                  <CardActionArea onClick={() => handleClick(row._id)}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography gutterBottom variant="h5" component="div">
                        <MedicationIcon fontSize="large"></MedicationIcon> Doctor: {row.doctor?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(row.date)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))
            }
          </Container>
        </Grid>
      </Grid>
    </Container>

    // <Container maxWidth="xl">
    //   <Paper elevation={3} sx={{ p: "20px", my: "40px", paddingBottom: 5 }}>
    //     <Container
    //       sx={{
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "space-between",
    //         my: 5,
    //       }}
    //     >
    //       <Container sx={{ width: "48%" }}>
    //         <form onSubmit={handleFilter}>
    //           <FormControl fullWidth>
    //             <InputLabel id="doctor">Doctor Name</InputLabel>
    //             <Input placeholder="Search..." />
    //           </FormControl>
    //           <FormControl fullWidth>
    //             <InputLabel id="filter-by-filled"></InputLabel>
    //             <Select
    //               labelId="filter-by-filled"
    //               id="filter-by-filled"
    //               label="filled"
    //               defaultValue="filled"
    //               uncontrolled="true"
    //               fullWidth
    //             >
    //               <MenuItem value="filled">Filled</MenuItem>
    //               <MenuItem value="unfilled">Unfilled</MenuItem>
    //             </Select>
    //           </FormControl>

    //           <FormControl fullWidth>
    //             <LocalizationProvider dateAdapter={AdapterDayjs}>
    //               <DateTimePicker
    //                 slotProps={{
    //                   actionBar: {
    //                     actions: ["clear"],
    //                   },
    //                 }}
    //               ></DateTimePicker>
    //             </LocalizationProvider>
    //           </FormControl>

    //           <FormControl fullWidth>
    //             <Button
    //               fullWidth
    //               type="submit"
    //               variant="contained"
    //               sx={{ mt: 3, mb: 2, p: 2, fontWeight: "bold" }}
    //             >
    //               Filter
    //             </Button>
    //           </FormControl>
    //         </form>

    //         <Button
    //           fullWidth
    //           type="submit"
    //           variant="contained"
    //           onClick={fetchTableData}
    //           sx={{ mt: 3, mb: 2, p: 2, fontWeight: "bold" }}
    //         >
    //           Clear
    //         </Button>
    //       </Container>
    //     </Container>
    //   </Paper>
    //   <Table>
    //     <TableHead>
    //       <TableRow>
    //         {/* <TableCell key="patient">Patient</TableCell> */}
    //         <TableCell key="doctor">Doctor</TableCell>
    //         <TableCell key="filled">Prescription Collected</TableCell>
    //         <TableCell key="date">Date</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {data &&
    //         data.map((row) => (
    //           <TableRow key={row.patient?.name} onClick={() => handleClick(row._id)} style={{ cursor: 'pointer', transition: 'background-color 0.3s' }} hover>
    //             {/* <TableCell>{row.patient?.name}</TableCell> */}
    //             <TableCell>{row.doctor?.name}</TableCell>
    //             <TableCell>{row.filled.toString() == "true"? "Collected": "Not Collected"}</TableCell>
    //             <TableCell>{formatDate(row.date)}</TableCell>
    //             {/* <TableCell>
    //               {console.log("ID is: "+row._id)}
    //               <Button onClick={() => handleClick(row._id)}>
    //                 Select Prescription
    //               </Button>
    //             </TableCell> */}
    //           </TableRow>
    //         ))}
    //     </TableBody>
    //   </Table>
    // </Container>
  );
}
