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
    Grid,
    Card,
    CardContent,
    CardActions,
    CardActionArea,
  } from "@mui/material";
  
  import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
  import React, { useEffect, useState } from "react";
  import { styled } from '@mui/material/styles';
  import Table from '@mui/material/Table';
  import TableBody from '@mui/material/TableBody';
  import TableCell, { tableCellClasses } from '@mui/material/TableCell';
  import TableContainer from '@mui/material/TableContainer';
  import TableHead from '@mui/material/TableHead';
  import TableRow from '@mui/material/TableRow';
  import axios from "axios";
  import { useUser } from "../../userContest";
  import { useNavigate } from "react-router-dom";
  import { Link } from "react-router-dom";
  import { darken } from '@mui/system';
import PermIdentity from "@mui/icons-material/PermIdentity";
import EventIcon from '@mui/icons-material/Event';
import { useTheme } from "@mui/material/styles";

  
  export default function DoctorViewPrescriptions() {
    const [data, setData] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState({});
    const { userId } = useUser();
    // const id = "655089b786a7e9fff5d1d36a";
    const id = userId;
    const navigate = useNavigate();
    const theme = useTheme();

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
        border: 0,
    }));
  
    const fetchTableData = () => {
      axios
        .get(`http://localhost:8000/doctors/${id}/prescriptions`, {
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
  
    const handleClick = (id) => {
      navigate(`/doctor/prescriptions/${id}`);
    };
  
    const formatDate = (dateString) => {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
    
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (

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
                  backgroundColor: theme.palette.primary.main, // Change the text color on hover
                  color: "white",
                }, }}>
                  <CardActionArea onClick={() => handleClick(row._id)}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography gutterBottom variant="h5" component="div">
                        <PermIdentity fontSize="large"></PermIdentity> Patient: {row.patient?.name}
                      </Typography>
                      <Typography variant="body2">
                        <EventIcon></EventIcon> {formatDate(row.date)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))
            }
          </Container>
        </Grid>

    );
  }
  