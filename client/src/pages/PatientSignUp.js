import * as React from 'react';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField, Grid, Button, Box, Container, FormControl, Typography, Divider, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm } from "react-hook-form"
import Avatar from '@mui/material/Avatar';
import logo from '../assets/gifs/logo.gif';
import ContactPageIcon from '@mui/icons-material/ContactPage';

const defaultTheme = createTheme();

export default function PatientSignUp() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();

  const onSubmit = data => {
    console.log("Data to server" + JSON.stringify(data));
  }
  console.log(errors);

  const handleChange = (event) => {
    if (errors[event.target.name]) {
      setError(event.target.name,
        {
          type: errors[event.target.name]["type"],
          message: errors[event.target.name]["type"]
        })
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundSize: 'cover',
            backgroundColor: '#d9d9d9',
            backgroundPosition: 'center',
          }}
        >
          <img src={logo} style={{
            height: '50%',
            position: 'fixed',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }} />
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 0, bgcolor: 'secondary.main', width: 40, height: 40 }}>
              <ContactPageIcon sx={{ width: 30, height: 30 }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: "bold", my: 2 }}> Patient Sign Up </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container md={12} spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    autoFocus
                    id="name"
                    label="Name"
                    {...register("Name", { required: true, maxLength: 80 })}
                    error={!!errors["Name"]}
                    helperText={errors["Name"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>

                <Grid item xs={12} >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        disableFuture
                        label="Date of Birth"
                        sx={{ width: '100%' }}
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
                    {...register("Phone", { required: true, minLength: 4, maxLength: 12 })}
                    error={!!errors["Phone"]}
                    helperText={errors["Phone"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    fullWidth
                    id="username"
                    type="text"
                    // placeholder="username"
                    label="Username"
                    {...register("Username", { required: true, maxLength: 80 })}
                    error={!!errors["Username"]}
                    helperText={errors["Username"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    type="email"
                    {...register("Email", { required: true, maxLength: 80 })}
                    error={!!errors["Email"]}
                    helperText={errors["Email"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="password"
                    label="Password"
                    type="password"
                    {...register("Password", { required: true, maxLength: 80 })}
                    error={!!errors["Password"]}
                    helperText={errors["Password"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>

                <Grid item xs={12} >
                  <FormControl sx={{ mt: 2 }}>
                    <FormLabel id="gender-label">Gender</FormLabel>
                    <RadioGroup
                      row
                      defaultValue="male"
                      id="gender"
                      name="gender"
                    >
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Divider sx={{
                  width: '60%',
                  borderWidth: '1px',
                  mx: 'auto',
                  my: 5,
                  borderColor: '#ccc',
                  filter: 'blur(1px)'
                }} />
                <Typography sx={{ align: "center", width: "100%", mb: 2, fontWeight: 'bold'}} variant="h6"> Emergency Contact </Typography>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="emergencyName"
                    label="Name"
                    {...register("EmergencyName", { required: true, maxLength: 80 })}
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
                    {...register("EmergencyPhone", { required: true, maxLength: 80 })}
                    error={!!errors["EmergencyPhone"]}
                    helperText={errors["EmergencyPhone"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>
              </Grid>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, p: 2, fontWeight: 'bold' }}
              >
                Register
              </Button>
            </form>
            <Typography sx={{ align: "center", width: "100%", mt: 5, mb: 2, fontWeight: 'bold', color: '#555'}} variant="h6"> OR </Typography>
            <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, p: 2, fontWeight: 'bold' }}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, p: 2, fontWeight: 'bold' }}
              >
                Doctor Sign Up
              </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}