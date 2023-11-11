import React from "react";
import "./App.css";
import PatientRegister from "./pages/authentication/PatientRegister";
import DoctorRegister from "./pages/authentication/DoctorRegister";
import SignIn from "./pages/authentication/SignIn";
// import AdminDashboard from './pages/admin/AdminDashboard';
import AdminManageAdmins from "./pages/admin/AdminManageAdmins";
import AdminManageDoctors from "./pages/admin/AdminManageDoctors";
import AdminManagePatients from "./pages/admin/AdminManagePatients";
import AdminManagePackages from "./pages/admin/AdminManagePackages";
import AdminManageDoctorRequests from "./pages/admin/AdminManageDoctorRequests";
import DoctorManageProfile from "./pages/doctor/DoctorManageProfile";
import DoctorManageAppointments from "./pages/doctor/DoctorManageAppointments";
import DoctorManagePatients from "./pages/doctor/DoctorManagePatients";
import PatientManageFamily from "./pages/patient/PatientManageFamily";
import PatientManageDoctors from "./pages/patient/PatientManageDoctors";
import PatientManagePrescriptions from "./pages/patient/PatientManagePrescriptions";
import PatientManageInfo from './pages/patient/PatientManageInfo';
import PatientManageAppointments from "./pages/patient/PatientManageAppointments";
// import DoctorManageInfo from './pages/doctor/DoctorManageInfo'
import DoctorManageFreeSlots from './pages/doctor/DoctorManageFreeSlots'
import DoctorManageContracts from './pages/doctor/DoctorManageContracts'
import DoctorManageFollowUp from './pages/doctor/DoctorManageFollowUp'

import AddHealthRecords from './pages/doctor/DoctorAddHealthRecords'
import AddFamilyMember from './components/formComponents/linkFamilyMembers'
import PatientManageFamilyLinks from './pages/patient/PatientManageFamilyLinks';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminEditPackage from "./pages/admin/AdminEditPackage";
// import EditDoctorProfile from './components/formComponents/EditDoctorProfile';
import axios from "axios";
function App() {
  axios.defaults.withCredentials = true;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <SignIn />,
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: "/register/patient",
      element: <PatientRegister />,
    },
    {
      path: "/register/doctor",
      element: <DoctorRegister />,
    },
    {
      path: "/admin/admins",
      element: <AdminManageAdmins />,
    },
    {
      path: "/admin/doctors",
      element: <AdminManageDoctors />,
    },
    {
      path: "/admin/patients",
      element: <AdminManagePatients />,
    },
    {
      path: "/admin/packages",
      element: <AdminManagePackages />,
    },
    {
      path: "/admin/packages/:id",
      element: <AdminEditPackage />,
    },
    {
      path: "/admin/doctor-requests",
      element: <AdminManageDoctorRequests />,
    },
    {
      path: "/doctor/profile",
      element: <DoctorManageProfile />,
    },
    {
      path: "/doctor/profile/:id",
      element: <DoctorManageProfile />,
    },
    {
      path: "/doctor/appointments",
      element: <DoctorManageAppointments />,
    },
    {
      path: "/doctor/info",
      element: <DoctorManageInfo />,
    },
    {
      path: "/doctor/patients",
      element: <DoctorManagePatients />,
    },
    {
      path: "/doctor/freeSlots",
      element: <DoctorManageFreeSlots />,
    },
    {
      path: "/patient/family",
      element: <PatientManageFamily />,
    },
    {
      path: "/patient/family/:id",
      element: <PatientManageFamily />,
    },
    {
      path: "/patient/appointments",
      element: <PatientManageAppointments />,
    },
    {
      path: "/patient/doctors",
      element: <PatientManageDoctors />,
    },
    {
      path: "/patient/prescriptions",
      element: <PatientManagePrescriptions />,
    },
    {
      path: "/patient/info",
      element: <PatientManageInfo />,
    },
    {
      path: "/patient/linkFamilyMember",
      element: <PatientManageFamilyLinks />,
    },
    {
      path: "/doctor/contracts",
      element: <DoctorManageContracts />,
    },
    {
      path: "/doctor/followups",
      element: <DoctorManageFollowUp />,
    },
    {
      path: "/doctor/addHealthRecords",
      element: <AddHealthRecords/>,
    },
    {
      path: "/patient/bookAppointment/:id",
      element: <PatientBookAppointments/>,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

