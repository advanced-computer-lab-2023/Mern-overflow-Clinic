import * as React from 'react';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField, Grid, Button, Box, Container, FormControl, Typography, Divider, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useForm } from "react-hook-form"
import Avatar from '@mui/material/Avatar';
import logo from '../../assets/gifs/logo.gif';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import sha256 from 'js-sha256';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function DoctorRegister() {

  const [file, setFiles] = useState([]);
  const [selectedType, setSelectedType] = useState('nationalID');
  const [allTypes, setAllTypes] = useState([]);
  
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors }, control } = useForm();

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleFileChange = (e) => {
    //const updatedTypes = [...allTypes, selectedType];
   // setAllTypes(updatedTypes);
   //setFiles(e.target.files);
   const file = Array.from(e.target.files);
    setFiles(file);
    // const selectedFiles = e.target.files;
    // const newFilesArray = [...files]; 
  
    //setFiles(newFilesArray);
  };

  function openPDF(e, path) {
    e.preventDefault(); // Prevent the default behavior of the link (e.g., opening in a new tab)
    console.log("path is: " + path);
    window.open(path, '_blank');
  }



  const onSubmit = data => {
    console.log("files" + JSON.stringify(file));
    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      const f = file[i];   
      formData.append(`files`, f);
       console.log("file is: " + JSON.stringify(f));
    }
    const dataToServer = { ...data };
    dataToServer["passwordHash"] = sha256(data["password"]);
    delete dataToServer.password

    if (file.length === 0) return alert("Please select a file to upload");
    formData.append('datatoserver', JSON.stringify(dataToServer));
    
    
    //dataToServer= JSON.stringify(dataToServer) + JSON.stringify(files);
    console.log("Data to server" + JSON.stringify(dataToServer));
   
    //console.log("data is :" +  JSON.stringify(Object.fromEntries(formData.entries())));

    axios.post('http://localhost:8000/doctors', formData)
      .then((response) => {
        console.log('POST request successful', response);
        // axios.post("http://localhost:8000/auth/login", { username: dataToServer.username, passwordHash: dataToServer.passwordHash }).then((response) => {
        //   navigate("/");
        // })
        navigate("/");
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

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} sx={{ backgroundSize: 'cover', backgroundColor: '#132629', backgroundPosition: 'center' }}>
          <Typography variant="h4" sx={{
            color: "white", position: 'fixed',
            top: '15%', left: '22%'
          }}>El7a2ny Clinic</Typography>
          <img src={logo} alt="" style={{
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
            <Typography variant="h5" sx={{ fontWeight: "bold", my: 2 }}> Doctor Registration Request </Typography>
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
                  <FormControl fullWidth >
                    <InputLabel htmlFor="outlined-adornment-amount">Hourly Rate</InputLabel>
                    <OutlinedInput
                      fullWidth
                      inputProps={{ max: 10000 }}
                      type="number"
                      id="outlined-adornment-amount"
                      startAdornment={<InputAdornment position="start">EGP</InputAdornment>}
                      label="Hourly Rate"
                      {...register("hourlyRate", { required: true, maxLength: 80 })}
                      error={!!errors["hourlyRate"]}
                      helperText={errors["hourlyRate"]?.message}
                      onBlur={handleChange}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="affilation"
                    label="Affilation (Hospital)"
                    type="text"
                    {...register("affiliation", { required: true, maxLength: 80 })}
                    error={!!errors["affiliation"]}
                    helperText={errors["affiliation"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="education"
                    label="Educational Background"
                    type="text"
                    {...register("education", { required: true, maxLength: 80 })}
                    error={!!errors["education"]}
                    helperText={errors["education"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="speciality"
                    label="Speciality"
                    type="text"
                    {...register("speciality", { required: true, maxLength: 80 })}
                    error={!!errors["speciality"]}
                    helperText={errors["speciality"]?.message}
                    onBlur={handleChange}
                  />
                </Grid>

                <Grid container direction="column">
  <Grid item>
    <Typography variant="h5" sx={{ fontWeight: "normal", my: 2 }}>
      upload all required documents
    </Typography>
  </Grid>
  {/* <Grid item>
    <label htmlFor="id">document Type:</label>
    <select id="id" value={selectedType} onChange={handleTypeChange}>
      <option value="nationalID">nationalID</option>
      <option value="medical degree">medical degree</option>
      <option value="medical licenses">medical licenses</option>
    </select>
  </Grid> */}
  <Grid>
              <input type="file" multiple onChange={handleFileChange} />
        {/*{
        <ul>
          {files.map((file, index) => (
          <li key={index}>{file.name}</li>
          //< img src={file.path} alt="Document" onClick={(e) => openPDF(e, file.path)} style={{ width: '100px', height: '100px' }} />
          ))}
      </ul>}     */}
    </Grid>
</Grid>

              </Grid>
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
              to="/register/patient">
              Patient Registration
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider >
  );
}