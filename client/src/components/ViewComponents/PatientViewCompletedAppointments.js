// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Button,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Link,
//   TableRow,
// } from "@mui/material";
// import axios from "axios";
// import dayjs from "dayjs";
// import { useUser } from "../../userContest";
// //import { useNavigate } from 'react-router-dom';
// import CloseIcon from '@mui/icons-material/Close';
// import FollowUpBookingForm from './PatientManageFollowUp';

// export default function DoctorViewAppointments() {
//   const [data, setData] = useState([]);
//   const { userId } = useUser();
//   const id = userId;
//  // const navigate = useNavigate();
//   const [popupOpen, setPopupOpen] = useState(false);
//   const [bookingPopupOpen, setBookingPopupOpen] = useState(false);
//   const [selectedDoctorId, setSelectedDoctorId] = useState(null);

//   const fetchTableData = () => {
//     axios
//       .get(`http://localhost:8000/patients/${id}/completedAppointments`, {})
//       .then((res) => {
//         console.log(res.data);
//         setData(res.data);
//       })
//       .catch((error) => {
//         console.error("Error getting Appointment data", error);
//       });
//   };

//   useEffect(() => {
//     // Fetch data on page load
//     fetchTableData();

//     // Call "appointments/refresh" on page load
//     axios
//       .put(`http://localhost:8000/appointments/refresh`)
//       .then((res) => {
//         console.log(res.data);
//       })
//       .catch((error) => {
//         console.error("Error refreshing appointments", error);
//       });

//     // Fetch data on page refresh
//     const handleRefresh = () => {
//       fetchTableData();

//       // Call "appointments/refresh" on page refresh
//       axios
//         .put(`http://localhost:8000/appointments/refresh`)
//         .then((res) => {
//           console.log(res.data);
//         })
//         .catch((error) => {
//           console.error("Error refreshing appointments", error);
//         });
//     };

//     window.addEventListener('beforeunload', handleRefresh);

//     return () => {
//       window.removeEventListener('beforeunload', handleRefresh);
//     };
//   }, []);

//   // const handleBookAppointment = (selectedDoctor) => {
//   //   // Handle the navigation to the booking page with the appointment ID
//   //   const bookingURL = `/patient/bookFollowUp/${selectedDoctor}`;
//   //   navigate(bookingURL);
//   // };
//   const handleBookAppointment = (doctorId) => {
//     setSelectedDoctorId(doctorId);
//     setPopupOpen(true);
//   };
//   const handleClosePopup = () => {
//     setPopupOpen(false);
//   };
//   const handleOpenBookingPopup = () => {
//     setBookingPopupOpen(true);
//     setPopupOpen(false); // Optionally close the first popup
//   };
//   const handleCloseBookingPopup = () => {
//     setBookingPopupOpen(false);
//   };

//   return (
//     <Container maxWidth="xl">
//       <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
//         <Button
//           fullWidth
//           variant="contained"
//           onClick={fetchTableData}
//           style={{ marginBottom: 10, fontWeight: "bold" }}
//         >
//           View Completed Appointments
//         </Button>
//       </Paper>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell key="doctor">Doctor</TableCell>
//             <TableCell key="date">Date</TableCell>
//             <TableCell key="action">Action</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {Array.isArray(data.appointments) && data.appointments.length > 0 ? (
//             data.appointments.map((row) => (
//               <TableRow key={row._id}>
//                 <TableCell>{row.doctor && row.doctor.name}</TableCell>
//                 <TableCell>{dayjs(row.date).format("MMMM D, YYYY h:mm A")}</TableCell>
//                 <TableCell>
//                   <Button
//                     onClick={() => handleBookAppointment(row.doctor._id)}
//                     variant="contained"
//                   >
//                     Book A FollowUp
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={3}>No completed appointments available.</TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//       <Dialog open={popupOpen} onClose={handleClosePopup}>
//         <DialogTitle>
//           Follow-Up Booking
//           <IconButton
//             aria-label="close"
//             onClick={handleClosePopup}
//             sx={{
//               position: 'absolute',
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500],
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           <p>Would you like to book a follow-up appointment?</p>
//           <Link href={`/patient/bookFollowUp/${selectedDoctorId}`} color="primary">
//             Click here to proceed
//           </Link>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClosePopup}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// }



import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useUser } from "../../userContest";
import CloseIcon from '@mui/icons-material/Close';
import PatientManageAppointmentsPopup from './PatientManageFollowUp';

export default function DoctorViewAppointments() {
  const [data, setData] = useState([]);
  const { userId } = useUser();
  const [popupOpen, setPopupOpen] = useState(false);
  const [bookingPopupOpen, setBookingPopupOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const fetchTableData = () => {
    axios
      .get(`http://localhost:8000/patients/${userId}/completedAppointments`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error getting Appointment data", error);
      });
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleBookAppointment = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleOpenBookingPopup = () => {
    setBookingPopupOpen(true);
    setPopupOpen(false); // Close the initial popup
  };

  const handleCloseBookingPopup = () => {
    setBookingPopupOpen(false);
  };

  return (
    <Container maxWidth="xl">
      <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={fetchTableData}
          style={{ marginBottom: 10, fontWeight: "bold" }}
        >
          View Completed Appointments
        </Button>
      </Paper>
      <Table>
        {/* Table setup remains the same */}
        <TableHead>
          <TableRow>
            <TableCell key="doctor">Doctor</TableCell>
            <TableCell key="date">Date</TableCell>
            <TableCell key="action">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(data.appointments) && data.appointments.length > 0 ? (
            data.appointments.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.doctor && row.doctor.name}</TableCell>
                <TableCell>{dayjs(row.date).format("MMMM D, YYYY h:mm A")}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleBookAppointment(row.doctor._id)}
                    variant="contained"
                  >
                    Book A FollowUp
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>No completed appointments available.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Initial Popup Dialog */}
      <Dialog open={popupOpen} onClose={handleClosePopup}>
        <DialogTitle>
          Follow-Up Booking
          <IconButton onClick={handleClosePopup}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <p>Would you like to book a follow-up appointment?</p>
          <Button onClick={handleOpenBookingPopup} color="primary">
            Click here to proceed
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* FollowUpBookingForm Popup */}
      <PatientManageAppointmentsPopup
        open={bookingPopupOpen}
        onClose={handleCloseBookingPopup}
        doctorId={selectedDoctorId}
      />
    </Container>
  );
}
