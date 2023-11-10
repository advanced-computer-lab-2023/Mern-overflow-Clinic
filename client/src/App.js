import "./App.css";
import AdminManageAdmins from "./pages/admin/AdminManageAdmins";
import AdminManageDoctorRequests from "./pages/admin/AdminManageDoctorRequests";
import AdminManageDoctors from "./pages/admin/AdminManageDoctors";
import AdminManagePackages from "./pages/admin/AdminManagePackages";
import AdminManagePatients from "./pages/admin/AdminManagePatients";
import DoctorRegister from "./pages/authentication/DoctorRegister";
import PatientRegister from "./pages/authentication/PatientRegister";
import SignIn from "./pages/authentication/SignIn";
import DoctorManageAppointments from "./pages/doctor/DoctorManageAppointments";
import DoctorManageContracts from "./pages/doctor/DoctorManageContracts";
import DoctorManageFollowUp from "./pages/doctor/DoctorManageFollowUp";
import DoctorManageFreeSlots from "./pages/doctor/DoctorManageFreeSlots";
import DoctorManageInfo from "./pages/doctor/DoctorManageInfo";
import DoctorManagePatients from "./pages/doctor/DoctorManagePatients";
import DoctorManageProfile from "./pages/doctor/DoctorManageProfile";
import PatientManageAppointments from "./pages/patient/PatientManageAppointments";
import PatientManageDoctors from "./pages/patient/PatientManageDoctors";
import PatientManageFamily from "./pages/patient/PatientManageFamily";
import PatientManageInfo from "./pages/patient/PatientManageInfo";
import PatientManagePrescriptions from "./pages/patient/PatientManagePrescriptions";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminEditPackage from "./pages/admin/AdminEditPackage";
import PatientManageFamilyLinks from "./pages/patient/PatientManageFamilyLinks";

import React from "react";
import "./App.css";
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AddFamilyMember from './components/formComponents/AddFamilyMember'
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
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
