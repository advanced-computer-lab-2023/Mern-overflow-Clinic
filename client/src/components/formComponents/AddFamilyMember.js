import axios from "axios";
// import sha256 from "js-sha256";
import { useForm } from "react-hook-form";
import {
  Box,
  Grid,
  Typography,
  FormControl,
  Button,
  Container,
  Paper,
  TextField,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
// import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from '../../userContest';

const AddFamilyMember = () => {
  // let id = "6529347d1b1e1b92fd454eff";
  const { userId } = useUser();
  let id = userId;
  console.log(id);
  const [errorMessage, setErrorMessage] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  

  const onSubmit = (data) => {
    const dataToServer = { id: id, ...data };
    axios
      .post(`http://localhost:8000/patients/${id}/familyMember`, dataToServer)
      .then((response) => {
        console.log("PUT request successful", response);
        setErrorMessage(false);
        window.location.reload();
      })
      .catch((error) => {
        console.log(dataToServer);
        console.error("Error making PUT request", error);
        setErrorMessage(true);
      });
    
  };

  const handleChange = (event) => {
    if (errors[event.target.name]) {
      setError(event.target.name, {
        type: errors[event.target.name]["type"],
        message: errors[event.target.name]["type"],
      });
    }
  };

  return (
    <>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: "20px", my: "40px" }}>
          <Typography variant="h6" sx={{ mb: 4 }}>
            {" "}
            Add a New Family Member{" "}
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  id="name"
                  label="Name"
                  {...register("name", { required: true, maxLength: 80 })}
                  error={!!errors["name"]}
                  helperText={errors["name"]?.message}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id="email"
                  label="Email"
                  helperText={errors["Email"]?.message}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id="nationalId"
                  label="National ID"
                  {...register("nationalId", { required: true, maxLength: 80 })}
                  error={!!errors["nationalId"]}
                  helperText={errors["nationalId"]?.message}
                  type="number"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id="age"
                  label="Age"
                  {...register("age", { required: true, maxLength: 80 })}
                  error={!!errors["age"]}
                  helperText={errors["age"]?.message}
                  type="number"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    {...register("gender", { required: true, maxLength: 80 })}
                    error={!!errors["gender"]}
                    helperText={errors["gender"]?.message}
                    type="number"
                    fullWidth
                    required
                    sx={{ textAlign: "left" }}
                    labelId="gender-label"
                    id="gender-select"
                    label="Gender"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="relation">Relation</InputLabel>
                  <Select
                    {...register("relation", { required: true, maxLength: 80 })}
                    error={!!errors["relation"]}
                    helperText={errors["relation"]?.message}
                    type="number"
                    fullWidth
                    required
                    sx={{ textAlign: "left" }}
                    labelId="relation-label"
                    id="relation-select"
                    label="Relation"
                  >
                    <MenuItem value="husband">Husband</MenuItem>
                    <MenuItem value="wife">Wife</MenuItem>
                    <MenuItem value="child">Child</MenuItem>
                    <MenuItem value="parent">Parent</MenuItem>
                    <MenuItem value="sibling">Sibling</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}> {/* Adjust the size of the Grid item containing the button */}
                <Button
                  type="submit"
                  variant="contained" // Changed from 'outlined' to 'contained'
                  color="primary" // Set the button color
                  fullWidth
                  sx={{
                    p: 1.8,
                    fontWeight: "bold",
                    color: "white", // Set text color
                    mt: 2 // Add top margin for spacing
                  }}
                >
                  Add Member
                </Button>
              </Grid>
              {(errorMessage &&
                //TODO: 
      // <Modal
      //   open={open}
      //   onClose={setErr}
      //   aria-labelledby="modal-modal-title"
      //   aria-describedby="modal-modal-description"
      // >
      //   <Box>
      //     <Typography id="modal-modal-title" variant="h6" component="h2">
      //       Text in a modal
      //     </Typography>
      //     <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      //       Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      //     </Typography>
      //   </Box>
      // </Modal>
             <Typography color="red">Family Member should be registered as patient with correct NationalID</Typography>
              )}
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default AddFamilyMember;

