import PasswordIcon from "@mui/icons-material/Password";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { useUser } from "../../userContest";

import { Link } from "react-router-dom";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import sha256 from "js-sha256";
import { useUser } from "../../userContest";
import PatientDashboard from "../patient/PatientDashboard";
import AdminDashboard from "../admin/AdminDashboard";
import DoctorDashboard from "../doctor/DoctorDashboard";




import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createTheme, ThemeProvider } from "@mui/material/styles";


const GridContainer = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const theme = createTheme({
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
});

export default function ChangePassword() {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  const navigate = useNavigate();
  const { userId, setUserId, userRole, setUserRole } = useUser();


  const handleSubmit = (event) => {
    event.preventDefault();

    const oldPassword = new FormData(event.currentTarget).get("oldPassword");
    const newPassword = new FormData(event.currentTarget).get("newPassword");
    const confirmNewPassword = new FormData(event.currentTarget).get(
      "confirmNewPassword",
    );

    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }

    axios
      .post("http://localhost:8000/auth/change", {
        oldPasswordHash: sha256(oldPassword),
        newPasswordHash: sha256(newPassword),
      })
      .then(() => {
        alert("Password changed successfully!");

        axios
          .post("http://localhost:8000/auth/logout")
          .then(() => {
            navigate("/signin");
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
  };

  let contentBox;
  contentBox = (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="oldPassword"
        label="Old Password"
        name="oldPassword"
        type="password"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="newPassword"
        label="New Password"
        name="newPassword"
        type="password"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="confirmNewPassword"
        label="Confirm New Password"
        name="confirmNewPassword"
        type="password"
        autoFocus
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2, mb: 2, fontWeight: "bold" }}
      >
        Change Password
      </Button>
    </Box>
  );

  return (
    <>
  {userRole === "Patient" ? (
    <>
      <PatientDashboard title="Change Password" />
    </>
  ) : userRole === "Admin" ? (
    <>
      <AdminDashboard title="Change Password" />    </>
  ) : userRole === "Doctor" ? (
    <>
      <DoctorDashboard title="Change Password" />
    </>
  ) : (
    <p>Excuse me, who are you?</p>
  )}
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <PasswordIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
            Change Password
          </Typography>
          {contentBox}
        </Box>
        <Box display="flex" flexDirection="column">
          <Button variant="outlined" component={Link} to="/auth/forgotpassword">
            Forgot password?
          </Button>
          <Button sx={{ mt: "25px" }} component={Link} to={(userRole == "Patient")? "/patient/info" : (userRole == "Doctor")? "/doctor/info" : "/admin/admins"}>
            <ArrowBackIcon sx={{ mr: "5px" }} /> Back to Homepage
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
</>
  
  );
}
