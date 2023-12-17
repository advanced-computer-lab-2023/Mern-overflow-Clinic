import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Typography } from '@mui/material';
import { Button } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../../userContest';
import { set } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MedicationIcon from '@mui/icons-material/Medication';
import EventIcon from '@mui/icons-material/Event';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import WorkIcon from '@mui/icons-material/Work';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';


const PatientViewPrescriptionDetails = ({ match }) => {
	const navigate = useNavigate();
	const { userId } = useUser();
	const theme = useTheme();
	const patientId = userId;
	let { id } = useParams();
	const [prescription, setPrescription] = useState([]);
	const [medicine, setMedicine] = useState([]);
	const [successOpen, setSuccessOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorOpen, setErrorOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

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
	

	useEffect(() => {
		const response = axios.post(`http://localhost:8000/auth/token`).then((res) => {
			console.log("res.data", res.data);
			sessionStorage.setItem('authorization', res.data.authorization);
		});
	}, []);
	// const [errorMessage, setErrorMessage] = useState(null);

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
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover,
		},
		// hide last border
		'&:last-child td, &:last-child th': {
			border: 0,
		},
	}));

	const fetchPrescription = async () => {
		try {
			console.log("PresID " + id);
			const response = await axios.get(`http://localhost:8000/prescriptions/${id}`);

			console.log("HI " + response.data);
			setPrescription(response.data);


			let medList = [];

			for (let i = 0; i < response.data.medicine.length; i++) {
				let mId = response.data.medicine[i].medId;
				console.log("Hello " + mId);
				const res = await axios.get(`http://localhost:8000/prescriptions/medicineDetails/${mId}`);
				medList.push(res.data);
			}
			setMedicine(medList);
		} catch (error) {
			setErrorMessage("Error fetching prescription details");
			console.error("Error fetching prescription details:", error);
		}
	};

	useEffect(() => {
		fetchPrescription();
	}, [patientId]);

	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "long", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const handleClick = (pid) => {
		navigate(`/patient/prescriptions/${pid}/prescriptionDownload`);
	};

	const handleButtonClick = async () => {
		try {
		console.log("collecting");
		let x = 0;
		for (let i = 0; i < prescription.medicine.length; i++) {
			let medicine = await axios.get(`http://localhost:8000/prescriptions/medicineDetails/${prescription.medicine[i].medId}`);
			let medName = medicine.data.name;
			let medPrice = medicine.data.price;
			let medQuantity = prescription.medicine[i].quantity;
			let dataToServer = {
				medName,
				medPrice,
				medQuantity
			}
			try{
				await axios.post(`http://localhost:8000/prescriptions/${id}/addMedicineToCart`, dataToServer);
				x++;
			} catch (error) {
				console.error("Error adding medicine to cart:", error);
				if (error.response.status === 400) {
					setErrorMessage(error.response.data + " for " + medName);
					setErrorOpen(true);
				}
			}
			console.log("LOOP: " + i);
		}
		console.log("DONE");
		if (x > 0) {
		window.location.href = `http://localhost:3001/auth/redirect/${encodeURIComponent(sessionStorage.getItem('authorization'))}`;
		}
		} catch (error) {
			console.error("Error collecting prescription:", error);
		}
	}

	return (

		<Container sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
			<Grid container spacing={10} sx={{ width: '100%' }}>
				{/* Left third of the page */}
				<Grid item xs={12} md={4} sx={{ width: '100%' }}>
					<Card justifyContent="center" alignItems="center" elevation={5} sx={{ maxWidth: 500, width: '150%', height: '50vh', margin: '5em 0em 5em -7.5em', borderRadius: '0.8em', position: 'fixed' }}>
						<CardContent>
								<Typography variant="h5" component="div" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '3em', marginTop: '0.5em' }}>
									Prescription Details
								</Typography>
							<Container sx={{ width: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'flex-start' }}>
								<Typography gutterBottom variant="h5" component="div">
									<PermIdentityIcon fontSize="large"></PermIdentityIcon> Doctor: {prescription.doctor?.name}
								</Typography>
								<Typography gutterBottom variant="h5" component="div">
									<WorkIcon></WorkIcon> {prescription.doctor?.speciality}
								</Typography>
								<Typography variant="body2">
									<EventIcon></EventIcon> {formatDate(prescription.date)}
								</Typography>
								<Typography variant="body2">
									{prescription.filled ? <CheckBoxIcon></CheckBoxIcon> : <DisabledByDefaultIcon></DisabledByDefaultIcon>} Prescription Collected
								</Typography>

							</Container>

						</CardContent>
						<CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

							{!prescription.filled && (
								<Button variant="outlined" onClick={handleButtonClick} sx={{ margin: '1em', width: '80%' }}>
									Collect Prescription
								</Button>
							)}

							<Button variant="contained" onClick={() => handleClick(id)} sx={{ margin: '1em', width: '80%' }}>
								View Official Prescription Document
							</Button>

						</CardActions>
					</Card>

				</Grid>
				{/* Right two thirds of the page */}
				<Grid item xs={12} md={8} >
					<Container elevation={5} sx={{
						display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
						margin: '5em -7.5em 5em 5em', width: '125%', position: 'sticky', maxHeight: '70vh',
						overflow: 'auto', border: '1px solid #ccc', borderRadius: '0.8em',
						'::-webkit-scrollbar': { width: '12px' }, '::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '6px' },
						'::-webkit-scrollbar-track': { backgroundColor: '#eee', borderRadius: '8px' }
					}}>
						{medicine.map((med, index) => (
							<Card key={index} elevation={5} sx={{
								maxWidth: 1000, margin: '2em -3em 2em 0em', width: '75%', borderRadius: '0.8em', transition: 'background-color 0.1s ease-in-out',
								'&:hover': {
									backgroundColor: theme.palette.primary.main, // Change the text color on hover
									color: "white",
								},
							}}>
									<CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
										<Typography gutterBottom variant="h5" component="div">
											<MedicationIcon fontSize="large"></MedicationIcon> {med?.name.charAt(0).toUpperCase() + med.name.slice(1).toLowerCase()}
										</Typography>
										<Typography variant="body2">
											<AddAlarmIcon></AddAlarmIcon> {prescription.medicine[index]?.dailyDosage} {prescription.medicine[index]?.dailyDosage === 1 ? 'dosage' : 'dosages'} per day
										</Typography>
										<Typography variant="body2">
											<HelpOutlineIcon></HelpOutlineIcon> Used for {med?.medicinalUse}
										</Typography>
										<Typography variant="body2">
											<AttachMoneyIcon></AttachMoneyIcon> Price: {med?.price}
										</Typography>
										<Typography variant="body2">
											<ShoppingCartIcon></ShoppingCartIcon> Quantity: {prescription.medicine[index]?.quantity}
										</Typography>
									</CardContent>
							</Card>
						))}

					</Container>
				</Grid>
			</Grid>

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

		</Container>

	);
};


const styles = {
	container: {
		fontFamily: 'Arial, sans-serif',
		margin: '20px',
	},
	errorMessage: {
		color: 'red',
		marginBottom: '10px',
	},
	table: {
		width: '100%',
		borderCollapse: 'collapse',
		marginBottom: '20px',
	},
	th: {
		backgroundColor: '#f2f2f2',
		padding: '10px',
		textAlign: 'left',
	},
	td: {
		border: '1px solid #dddddd',
		padding: '8px',
		textAlign: 'left',
	},
};


export default PatientViewPrescriptionDetails;