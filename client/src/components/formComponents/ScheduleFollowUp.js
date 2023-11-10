import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
    Box,
    Typography,
    FormControl,
    Button,
    Container,
    Paper,
    TextField,
} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

const ScheduleFollowUp = () => {
    let id = "65293c2cb5a34d208108cc33";
    const [email, setEmail] = useState("");
    const [price, setPrice] = useState("");
    const [date, setDate] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/doctors/${id}`, { params: { id: id } });
                setEmail(response.data[0].email);
                setPrice(response.data[0].price);
                setDate(response.data[0].date);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();

        // Validate if the selected date is in the future
        const selectedDate = new Date(date);
        const currentDate = new Date();
        if (selectedDate < currentDate) {
            setStatusMessage("Please select a future date for the session.");
            setIsSuccess(false);
            return;
        }

        // Clear the status message
        setStatusMessage("");

        const dataToServer = { email, price, date };
        axios.post(`http://localhost:8000/doctors/${id}/createFollowup`, dataToServer)
            .then((response) => {
                console.log('POST request successful', response);
                setStatusMessage("Follow-up scheduled successfully");
                setIsSuccess(true);
                // Clear the input fields
                setEmail("");
                setPrice("");
                setDate("");
            })
            .catch((error) => {
                console.error('Error making POST request', error);
                setStatusMessage("Error scheduling follow-up. Please try again.");
                setIsSuccess(false);
            });
    }

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                <Typography variant="h6" sx={{ mb: 4 }}> Schedule A Follow Up With A Patient </Typography>
                <Box component="form" onSubmit={onSubmit}>
                    <TextField
                        sx={{ mb: 3 }}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        type="email"
                        label="Patient Email"
                        required
                        fullWidth
                        autoFocus
                    />
                    <FormControl sx={{ mb: 3 }} fullWidth>
                        <InputLabel htmlFor="outlined-adornment-amount">Session Price</InputLabel>
                        <OutlinedInput
                            value={price}
                            autoComplete="off"
                            onChange={(e) => { setPrice(e.target.value) }}
                            fullWidth
                            required
                            inputProps={{ max: 10000, min: 10 }}
                            type="number"
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start">EGP</InputAdornment>}
                            label="Session Price"
                        />
                    </FormControl>
                    <TextField
                        sx={{ mb: 3 }}
                        value={date}
                        type="date"
                        onChange={(e) => { setDate(e.target.value) }}
                        label=""
                        required
                        fullWidth
                    />
                    {statusMessage && (
                        <Typography sx={{
                            border: "1px solid transparent",
                            borderRadius: 5,
                            padding: 2,
                            color: isSuccess ? "green" : "red"
                        }}>
                            {statusMessage}
                        </Typography>
                    )}
                    <Button type="submit" variant="contained" fullWidth sx={{ mb: 3, p: 1.8, fontWeight: 'bold' }}>
                        Schedule Follow Up
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default ScheduleFollowUp;
