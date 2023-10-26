import * as React from 'react';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField, Alert, Grid, Button, Box, Container, FormControl, Typography, Divider, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useForm } from "react-hook-form"
import Avatar from '@mui/material/Avatar';
import logo from '../../assets/gifs/logo.gif';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import { useState } from 'react';
import sha256 from 'js-sha256';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();


  


export default function PatientRegister() {

  // const [files, setFiles] = useState([]);
  // //const formData = new FormData();


  // const handleFileChange = (e) => {
  //   const selectedFiles = e.target.files;
  //   const newFilesArray = [...files]; // Copy the current files array
    
  // for (let i = 0; i < selectedFiles.length; i++) {
  //   const file = selectedFiles[i];   
  //   //formData.append(`file${i}`, file);
  //   const fileName = file.name;
  //   const filePath = URL.createObjectURL(file);
  //   const fileInfo = { filename: fileName, path: filePath };
  //   newFilesArray.push(fileInfo);
  // }
  //   setFiles(newFilesArray);
  // };

  // function openPDF(e, path) {
  //   e.preventDefault(); // Prevent the default behavior of the link (e.g., opening in a new tab)
    
  //   // Open the PDF in a new tab or window using the provided path
  //   window.open(path, '_blank');
  // }


  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors }, control } = useForm();

  const onSubmit = data => {
    const dataToServer = { ...data};
    dataToServer["passwordHash"] = sha256(data["password"]);
    dataToServer["emergencyContact"] = { name: data["EmergencyName"], mobileNumber: data["EmergencyPhone"] };
    delete dataToServer.EmergencyName
    delete dataToServer.EmergencyPhone
    delete dataToServer.password
    
    // const combinedData = {
    //   ...dataToServer,  // Include the properties from dataToServer
    //   files: files,
    // };
    // //dataToServer= JSON.stringify(dataToServer) + JSON.stringify(files);
    // //console.log("Data to server" + JSON.stringify(dataToServer));
    // //console.log("files" + JSON.stringify(files));
    // console.log("data" + JSON.stringify(combinedData));
    axios.post('http://localhost:8000/patients',dataToServer)
      .then((response) => {
        console.log('POST request successful', response);
        navigate('/patient/family');
      })
      .catch((error) => {
        console.error('Error making POST request', error);
        alert('Error making POST request: ' + error.message);
      });
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

  // fetch("URL_TO_PDF_FILE") // Replace with the URL to your PDF file
  // .then(response => response.blob())
  // .then(blob => {
  //   const blobUrl = URL.createObjectURL(blob);
  //   const pdfObject = document.createElement('object');
  //   pdfObject.data = blobUrl;
  //   pdfObject.type = 'application/pdf';
  //   pdfObject.width = '100%';
  //   pdfObject.height = '600';
  //   document.body.appendChild(pdfObject);
  // });

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
            <Typography variant="h5" sx={{ fontWeight: "bold", my: 2 }}> Patient Registration </Typography>
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

                <Grid item xs={12} >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <Controller
                        control={control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <DatePicker
                            sx={{ width: "100%" }}
                            openTo="year"
                            views={['year', 'month', 'day']}
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
                    {...register("mobileNumber", { required: true, minLength: 8, maxLength: 16 })}
                    error={!!errors["mobileNumber"]}
                    helperText={errors["mobileNumber"]?.message}
                    onBlur={handleChange}
                  />

                </Grid> <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="nationalId"
                    label="National ID"
                    type="number"
                    {...register("nationalId", { required: true, minLength: 8, maxLength: 16 })}
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
                          <FormControlLabel value="male" control={<Radio />} label="Male" />
                          <FormControlLabel value="female" control={<Radio />} label="Female" />
                        </RadioGroup>
                      )}
                    />
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
                <Typography sx={{ align: "center", width: "100%", mb: 2, fontWeight: 'bold' }} variant="h6"> Emergency Contact </Typography>

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
                    {...register("EmergencyPhone", { required: true, minLength: 8, maxLength: 16 })}
                    error={!!errors["EmergencyPhone"]}
                    helperText={errors["EmergencyPhone"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>
              </Grid>

              {/* <Grid>
              <input type="file" multiple onChange={handleFileChange} />
        {
        <ul>
          {files.map((file, index) => (
          <li key={index}>{file.filename}<a href={file.path} target="_blank" onClick={(e) => openPDF(e, file.path)}>view document</a></li>
          ))}
      </ul>}
     
      
    </Grid> */}
    

              <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, mb: 2, p: 2, fontWeight: 'bold' }}>
                Submit
              </Button>
            </Box>
            <Typography sx={{ align: "center", width: "100%", mt: 5, mb: 2, fontWeight: 'bold', color: '#555' }} variant="h6"> OR </Typography>
            <Button fullWidth type="submit" variant="outlined" sx={{ mt: 3, mb: 2, p: 2, fontWeight: 'bold' }}
              component={Link}
              to="/signin">
              Sign In
            </Button>
            <Button fullWidth type="submit" variant="outlined" sx={{ mt: 3, mb: 2, p: 2, fontWeight: 'bold' }}
              component={Link}
              to="/register/doctor">
              Doctor Registration
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}