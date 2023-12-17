import {
    IconButton,
    Paper,
    Table,
    Chip,
    Avatar,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress,
    Input,
    Snackbar,
    Alert,
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
    Radio
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PhoneIcon from "@mui/icons-material/Phone";
import { useForm } from "react-hook-form";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import WcIcon from "@mui/icons-material/Wc";
import TodayIcon from "@mui/icons-material/Today";
import LinkIcon from "@mui/icons-material/Link";
import LabelIcon from "@mui/icons-material/Label";
import PinIcon from "@mui/icons-material/Pin";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
import EmailIcon from "@mui/icons-material/Email";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { capitalize } from "../../utils";
import { useUser } from "../../userContest";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HealingIcon from '@mui/icons-material/Healing';
import SchoolIcon from '@mui/icons-material/School';
import { Save } from "@mui/icons-material";

export default function DoctorViewInfo(props) {
    const { userId } = useUser();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm();

    const [email, setEmail] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [affiliation, setAffiliation] = useState("");

    const fetchTableData = () => {
        axios.get(`http://localhost:8000/doctors/${userId}`).then((res) => {
            console.log(res.data);
            setData(res.data);
            setEmail(res.data.email);
            setHourlyRate(res.data.hourlyRate);
            setAffiliation(res.data.affiliation);
            setTimeout(() => setLoading(false), 500);
        });
    };

    const onSubmit = (data) => {
        const dataToServer = { email, hourlyRate, affiliation };
        axios
            .put(`http://localhost:8000/doctors/${userId}`, dataToServer)
            .then((response) => {
                console.log("PUT request successful", response);
                setEditing(false);
                fetchTableData();
            })
            .catch((error) => {
                console.error("Error making PUT request", error);
            });
    };

    const onEdit = () => {
        setEditing(true);
    }

    const onCancel = () => {
        setEditing(false);
    }

    useEffect(() => {
        fetchTableData();
    }, []);

    const handleSuccessClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        props.setSuccessOpen(false);
    };

    return (
        <Container maxWidth="md">
            <Snackbar open={props.successOpen} autoHideDuration={3000} onClose={handleSuccessClose}>
                <Alert elevation={6} variant="filled" onClose={handleSuccessClose} severity="success">
                    {props.successMessage}
                </Alert>
            </Snackbar>
            <Paper elevation={3} sx={{ p: "20px", my: "40px", paddingBottom: 5 }}>
                {loading ? (
                    <CircularProgress sx={{ mt: "30px" }} />
                ) : (
                    <Container>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Avatar
                                sx={{
                                    m: 0,
                                    bgcolor: "white",
                                    color: "#293241",
                                    width: 100,
                                    height: 100,
                                    padding: 0,
                                    textAlign: "center"
                                }}
                            >
                                <AccountCircleIcon sx={{ width: 100, height: 100, textAlign: "center" }} />
                            </Avatar>
                            <Typography sx={{ fontWeight: "bold", my: "20px", fontFamily: "monospace" }}>
                                Hello, {capitalize(data.name)}
                            </Typography>
                            <Table sx={{ width: "70%", ml: "15%" }}>
                                <TableBody>
                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell sx={{ width: "50%", textAlign: "right", border: "none" }}>
                                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <AlternateEmailIcon sx={{ mr: "10px" }} />
                                                <Typography>Username</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ border: "none", textAlign: "left" }}>
                                            {data.username}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell sx={{ width: "50%", textAlign: "right", border: "none" }}>
                                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <PinIcon sx={{ mr: "10px" }} />
                                                <Typography>Password</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ border: "none", textAlign: "left" }}>
                                            <a href="/auth/changepassword">Change Your Password</a>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell sx={{ width: "50%", textAlign: "right", border: "none" }}>
                                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <EmailIcon sx={{ mr: "10px" }} />
                                                <Typography>Email</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ border: "none", textAlign: "left" }}>
                                            {!editing ?
                                                <>{data.email}</>
                                                : <TextField variant="standard"
                                                    value={email}
                                                    InputProps={{ style: { fontSize: '12px' } }}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                    }}
                                                    type="email"
                                                    required
                                                    fullWidth
                                                    autoFocus></TextField >
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell sx={{ width: "50%", textAlign: "right", border: "none" }}>
                                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <TodayIcon sx={{ mr: "10px" }} />
                                                <Typography>Date of Birth</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ border: "none", textAlign: "left" }}>
                                            {data.dateOfBirth
                                                .substring(0, 10)
                                                .replaceAll("-", "/")
                                                .split("/")
                                                .reverse()
                                                .join("/")}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell sx={{ width: "50%", textAlign: "right", border: "none" }}>
                                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <AccountBalanceWalletIcon sx={{ mr: "10px", color: "brown" }} />
                                                <Typography> Wallet Balance</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ border: "none", textAlign: "left" }}>
                                            EGP {data.wallet}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell sx={{ width: "50%", textAlign: "right", border: "none" }}>
                                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <MonetizationOnIcon sx={{ mr: "10px", color: "#008080" }} />
                                                <Typography>Hourly Rate</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ border: "none", textAlign: "left" }}>
                                            {!editing ?
                                                <>EGP {data.hourlyRate}</>
                                                : <TextField variant="standard" sx={{}}
                                                    value={`${hourlyRate}`}
                                                    InputProps={{ style: { fontSize: '12px' } }}
                                                    onChange={(e) => {
                                                        setHourlyRate(e.target.value);
                                                    }}
                                                    type="number"
                                                    required
                                                    fullWidth
                                                    autoFocus></TextField >
                                            }
                                        </TableCell>
                                    </TableRow>


                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell sx={{ width: "50%", textAlign: "right", border: "none" }}>
                                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <LocalHospitalIcon sx={{ mr: "10px", color: "#008080" }} />
                                                <Typography>Affiliation</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ border: "none", textAlign: "left" }}>
                                            {!editing ?
                                                <>{capitalize(data.affiliation)}</>
                                                : <TextField variant="standard" sx={{}}
                                                    value={affiliation}
                                                    InputProps={{ style: { fontSize: '12px' } }}
                                                    onChange={(e) => {
                                                        setAffiliation(e.target.value);
                                                    }}
                                                    type="text"
                                                    required
                                                    fullWidth
                                                    autoFocus></TextField >
                                            }
                                        </TableCell>
                                    </TableRow>


                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell sx={{ width: "50%", textAlign: "right", border: "none" }}>
                                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <HealingIcon sx={{ mr: "10px", color: "#008080" }} />
                                                <Typography>Specialty</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ border: "none", textAlign: "left" }}>
                                            {capitalize(data.speciality)}
                                        </TableCell>
                                    </TableRow>


                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell sx={{ width: "50%", textAlign: "right", border: "none" }}>
                                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <SchoolIcon sx={{ mr: "10px", color: "#008080" }} />
                                                <Typography>Education</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ border: "none", textAlign: "left" }}>
                                            {capitalize(data.education)}
                                        </TableCell>
                                    </TableRow>

                                </TableBody>
                            </Table>
                            {editing ?
                                <>
                                    <Button variant="contained" sx={{ mt: "25px" }} onClick={onSubmit}>
                                        <SaveIcon sx={{ mr: "5px" }} /> Save Changes
                                    </Button>
                                    <Button variant="outlined" sx={{ mt: "25px" }} onClick={onCancel}>
                                        <CancelIcon sx={{ mr: "5px" }} /> Cancel
                                    </Button>
                                </>
                                :
                                <Button variant="outlined" sx={{ mt: "25px" }} onClick={onEdit}>
                                    <EditIcon sx={{ mr: "5px" }} /> Edit your profile
                                </Button>
                            }
                        </Box>





                    </Container>
                )
                }
            </Paper >
        </Container >



    );

}

