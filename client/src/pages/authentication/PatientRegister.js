import * as React from "react";
import Paper from "@mui/material/Paper";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  TextField,
  Grid,
  Button,
  Box,
  Container,
  FormControl,
  Typography,
  Divider,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useForm } from "react-hook-form";
import Avatar from "@mui/material/Avatar";
import logo from "../../assets/gifs/logo.gif";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import sha256 from "js-sha256";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../userContest";
import { Snackbar, Alert } from "@mui/material";

const defaultTheme = createTheme();


  


export default function PatientRegister() {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  const navigate = useNavigate();
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = (data) => {
    const dataToServer = { ...data};
    dataToServer["passwordHash"] = sha256(data["password"]);
    dataToServer["emergencyContact"] = {
      name: data["EmergencyName"],
      mobileNumber: data["EmergencyPhone"],
      relation: data["EmergencyRelation"],
    };
    delete dataToServer.EmergencyName;
    delete dataToServer.EmergencyPhone;
    delete dataToServer.EmergencyRelation;
    delete dataToServer.password;

    console.log("Data to server" + JSON.stringify(dataToServer));

    axios
      .post("http://localhost:8000/patients", dataToServer)

      .then((response) => {
        console.log("POST request successful", response);
        const userId = response.data.userId;

        setUserId(userId);
        setUserRole("Patient");
        axios.post("http://localhost:8000/auth/login", {
          username: dataToServer.username,
          passwordHash: dataToServer.passwordHash,
        });
      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setErrorOpen(true);
        console.error("Error making POST request", error);
      });
  };

  console.log(errors);

  const handleChange = (event) => {
    if (errors[event.target.name]) {
      setError(event.target.name, {
        type: errors[event.target.name]["type"],
        message: errors[event.target.name]["type"],
      });
    }
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

  return (
    <ThemeProvider theme={defaultTheme}>

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

      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundSize: "cover",
            backgroundColor: "#132629",
            backgroundPosition: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "white",
              position: "fixed",
              top: "15%",
              left: "22%",
            }}
          >
            El7a2ny Clinic
          </Typography>
          <img
            src={logo}
            alt=""
            style={{
              height: "50%",
              position: "fixed",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{ m: 0, bgcolor: "secondary.main", width: 40, height: 40 }}
            >
              <ContactPageIcon sx={{ width: 30, height: 30 }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: "bold", my: 2 }}>
              {" "}
              Patient Registration{" "}
            </Typography>
            {/* <Alert severity="error"></Alert> */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container md={12} spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    autoFocus
                    id="name"
                    label="Name"
                    {...register("name", { required: true, maxLength: 80 })}
                    error={!!errors["name"]}
                    helperText={errors["name"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <Controller
                        control={control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <DatePicker
                            sx={{ width: "100%" }}
                            openTo="year"
                            views={["year", "month", "day"]}
                            mask="____-__-__"
                            format="DD-MM-YYYY"
                            label="Date of Birth"
                            inputFormat="DD-MM-YYYY"
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                          >
                            {({ inputProps, inputRef }) => (
                              <TextField
                                {...inputProps}
                                sx={{ width: "100%" }}
                                error={!!errors["dateOfBirth"]}
                                helperText={errors["dateOfBirth"]?.message}
                                inputRef={inputRef}
                              />
                            )}
                          </DatePicker>
                        )}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="phone"
                    label="Phone"
                    type="tel"
                    {...register("mobileNumber", {
                      required: true,
                      minLength: 8,
                      maxLength: 16,
                    })}
                    error={!!errors["mobileNumber"]}
                    helperText={errors["mobileNumber"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>{" "}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="nationalId"
                    label="National ID"
                    type="number"
                    {...register("nationalId", {
                      required: true,
                      minLength: 8,
                      maxLength: 16,
                    })}
                    error={!!errors["nationalId"]}
                    helperText={errors["nationalId"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    fullWidth
                    id="username"
                    type="text"
                    label="Username"
                    {...register("username", { required: true, maxLength: 80 })}
                    error={!!errors["username"]}
                    helperText={errors["username"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    type="email"
                    {...register("email", { required: true, maxLength: 80 })}
                    error={!!errors["email"]}
                    helperText={errors["email"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="password"
                    label="Password"
                    type="password"
                    {...register("password", { required: true, maxLength: 80 })}
                    error={!!errors["password"]}
                    helperText={errors["password"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ mt: 2 }}>
                    <FormLabel id="gender-label">Gender</FormLabel>
                    <Controller
                      control={control}
                      name="gender" // Ensure the name matches the one used in RadioGroup
                      defaultValue="male" // Set the default value if needed
                      render={({ field }) => (
                        <RadioGroup
                          row
                          {...field} // Spread the field props to RadioGroup
                        >
                          <FormControlLabel
                            value="male"
                            control={<Radio />}
                            label="Male"
                          />
                          <FormControlLabel
                            value="female"
                            control={<Radio />}
                            label="Female"
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Divider
                  sx={{
                    width: "60%",
                    borderWidth: "1px",
                    mx: "auto",
                    my: 5,
                    borderColor: "#ccc",
                    filter: "blur(1px)",
                  }}
                />
                <Typography
                  sx={{
                    align: "center",
                    width: "100%",
                    mb: 2,
                    fontWeight: "bold",
                  }}
                  variant="h6"
                >
                  {" "}
                  Emergency Contact{" "}
                </Typography>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="emergencyName"
                    label="Name"
                    {...register("EmergencyName", {
                      required: true,
                      maxLength: 80,
                    })}
                    error={!!errors["EmergencyName"]}
                    helperText={errors["EmergencyName"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="emergencyPhone"
                    label="Phone"
                    {...register("EmergencyPhone", {
                      required: true,
                      minLength: 8,
                      maxLength: 16,
                    })}
                    error={!!errors["EmergencyPhone"]}
                    helperText={errors["EmergencyPhone"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="emergencyRelation"
                    label="Relation"
                    {...register("EmergencyRelation", {
                      required: true,
                      minLength: 8,
                      maxLength: 16,
                    })}
                    error={!!errors["EmergencyRelation"]}
                    helperText={errors["EmergencyRelation"]?.message}
                    onBlur={handleChange}
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="emergencyRelation-label">Relation</InputLabel>
                    <Select
                      labelId="emergencyRelation-label"
                      id="emergencyRelation"
                      {...register("EmergencyRelation", {
                        required: true,
                      })}
                      error={!!errors["EmergencyRelation"]}
                      onBlur={handleChange}
                    >
                      <MenuItem value="">
                        <em>Choose a relation</em>
                      </MenuItem>
                      <MenuItem value="wife">Wife</MenuItem>
                      <MenuItem value="husband">Husband</MenuItem>
                      <MenuItem value="parent">Parent</MenuItem>
                      <MenuItem value="child">Child</MenuItem>
                      <MenuItem value="sibling">Sibling</MenuItem>
                      {/* Add more choices as needed */}
                    </Select>
                    {errors["EmergencyRelation"] && (
                      <FormHelperText error>{errors["EmergencyRelation"]?.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, p: 2, fontWeight: "bold" }}
              >
                Submit
              </Button>
            </Box>
            <Typography
              sx={{
                align: "center",
                width: "100%",
                mt: 5,
                mb: 2,
                fontWeight: "bold",
                color: "#555",
              }}
              variant="h6"
            >
              {" "}
              OR{" "}
            </Typography>
            <Button
              fullWidth
              type="submit"
              variant="outlined"
              sx={{ mt: 3, mb: 2, p: 2, fontWeight: "bold" }}
              component={Link}
              to="/signin"
            >
              Sign In
            </Button>
            <Button
              fullWidth
              type="submit"
              variant="outlined"
              sx={{ mt: 3, mb: 2, p: 2, fontWeight: "bold" }}
              component={Link}
              to="/register/doctor"
            >
              Doctor Registration
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
