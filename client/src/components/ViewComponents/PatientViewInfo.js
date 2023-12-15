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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PhoneIcon from "@mui/icons-material/Phone";
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

export default function PatientInfo(props) {
    const { userId } = useUser();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTableData = () => {
        axios.get(`http://localhost:8000/patients/${userId}`).then((res) => {
          console.log(res.data);
            setData(res.data);
            setTimeout(() => setLoading(false), 500);
        });
    };

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
                                {capitalize(data.name)}
                            </Typography>
                            <Table sx={{ width: "50%", ml: "50px" }}>
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
                                            {data.email}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell sx={{ width: "50%", textAlign: "right", border: "none" }}>
                                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <PhoneIcon sx={{ mr: "10px" }} />
                                                <Typography>Phone Number</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ border: "none", textAlign: "left" }}>
                                            {data.mobileNumber}
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
                                    <TableRow sx={{ borderBottomColor: "white" }}>
                                        <TableCell sx={{ width: "50%", textAlign: "right", border: "none" }}>
                                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <WcIcon sx={{ mr: "10px" }} />
                                                <Typography>Gender</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ border: "none", textAlign: "left " }}>
                                            {capitalize(data.gender)}
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
                                </TableBody>
                            </Table>
                        </Box>

                        <Divider sx={{ mt: "30px", mb: "20px", borderWidth: "45px" }}>
                            <Chip
                                sx={{ mx: "10px", backgroundColor: "#293241", color: "white", fontSize: "15px" }}
                                label="Emergency Contact"
                            />
                        </Divider>

                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Table sx={{ width: "50%", ml: "50px" }}>
                                <TableBody>
                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell sx={{ width: "50%", textAlign: "right", border: "none" }}>
                                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <LabelIcon sx={{ mr: "10px" }} />
                                                <Typography>Name</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ border: "none", textAlign: "left" }}>
                                            {data.emergencyContact[0].name}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell sx={{ width: "50%", textAlign: "right", border: "none" }}>
                                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <PhoneIcon sx={{ mr: "10px" }} />
                                                <Typography>Phone Number</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ border: "none", textAlign: "left" }}>
                                            {data.emergencyContact[0].mobileNumber}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Container>
                )}
            </Paper>
        </Container>
    );
}
