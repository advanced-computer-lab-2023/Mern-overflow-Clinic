import React from "react";
import "./App.css";
import AdminManageAdmins from "./pages/admin/AdminManageAdmins";
import AdminManageDoctorRequests from "./pages/admin/AdminManageDoctorRequests";
import AdminManageContracts from "./pages/admin/AdminManageContracts";
import AdminManageDoctors from "./pages/admin/AdminManageDoctors";
import AdminManagePackages from "./pages/admin/AdminManagePackages";
import AdminManagePatients from "./pages/admin/AdminManagePatients";
import DoctorRegister from "./pages/authentication/DoctorRegister";
import PatientRegister from "./pages/authentication/PatientRegister";
import SignIn from "./pages/authentication/SignIn";
import DoctorManageAppointments from "./pages/doctor/DoctorManageAppointments";
import DoctorManageInfo from "./pages/doctor/DoctorManageInfo";
import DoctorManagePatients from "./pages/doctor/DoctorManagePatients";
import PatientManageAppointments from "./pages/patient/PatientManageAppointments";
import PatientManageDoctors from "./pages/patient/PatientManageDoctors";
import PatientManageFollowUp from "./pages/patient/PatientViewCompletedAppointments";
import PatientManageFamily from "./pages/patient/PatientManageFamily";
import PatientManageInfo from "./pages/patient/PatientManageInfo";
import PatientManagePrescriptions from "./pages/patient/PatientManagePrescriptions";
import PatientManagePrescriptionDetails from "./pages/patient/PatientManagePrescriptionDetails";
import ChangePassword from "./pages/authentication/ChangePassword";
import ResetPassword from "./pages/authentication/ResetPassword";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import DoctorManageFreeSlots from "./pages/doctor/DoctorManageFreeSlots";
import DoctorManageContracts from "./pages/doctor/DoctorManageContracts";
import DoctorManageFollowUps from "./pages/doctor/DoctorManagePendingFollowUps";
import DoctorManageFollowUp from "./pages/doctor/DoctorManageFollowUp";
import DoctorManageRescheduaedlAppointments from "./pages/doctor/DoctorRechdualAppointment";
import DoctorManagePrescriptions from "./pages/doctor/DoctorManagePrescriptions";
import DoctorManagePrescriptionDetails from "./pages/doctor/DoctorManagePrescriptionDetails";
import PatientBookAppointments from "./pages/patient/patientBookAppointment";
import PatientBookFollowUp from "./pages/patient/patientBookAFollowUp";
import AddHealthRecords from "./pages/doctor/DoctorAddHealthRecords";
import PatientManageDocuments from './pages/patient/PatientManageDocuments';
import PatientManagePackages from './pages/patient/PatientManagePackages';
import PatientPayPackage from "./components/ViewComponents/PatientPayPackage";
import PatientManageHealthRecords from "./pages/patient/PatientManageHealthRecords";
import AddFamilyMember from "./components/formComponents/linkFamilyMembers";
import PatientManageFamilyLinks from "./pages/patient/PatientManageFamilyLinks";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminEditPackage from "./pages/admin/AdminEditPackage";
import DoctorDownloadPdf from "./pages/doctor/DoctorDownloadPdf";
import PatientDownloadPdf from "./pages/patient/PatientDownloadPdf";

// import PatientManageFamily from "./pages/patient/PatientManageFamily";
import axios from "axios";
import PatientPayAppointment from "./pages/patient/PatientPayAppointment";
import NotFoundPage from "./NotFoundPage";
import Chatpage from "./pages/Chatpage";


import PatientViewFamilyAppointments from "./pages/patient/PatientViewFamilyAppointments";

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
      path: "/admin/contracts",
      element: <AdminManageContracts />,
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
      path: "/doctor/appointments",
      element: <DoctorManageAppointments />,
    },
    {
      path: "/doctor/pendingFollowUps",
      element: <DoctorManageFollowUps />,
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
      path: "/doctor/prescriptions",
      element: <DoctorManagePrescriptions />,
    },
    {
      path: "/doctor/prescriptions/:id",
      element: <DoctorManagePrescriptionDetails />
    },
    {
      path: "/patient/family",
      element: <PatientManageFamily />,
    },
    {
      path: "/patient/documents",
      element: <PatientManageDocuments />,
    },
    {
      path: "/patient/packages",
      element: <PatientManagePackages />,
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
      path: "/patient/prescriptions/:id",
      element: <PatientManagePrescriptionDetails />,
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
      path: "/patient/pay/package",
      element: <PatientPayPackage />,
    },
    {
      path: "/patient/healthRecords",
      element: <PatientManageHealthRecords />,
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
      path: "/patient/followups",
      element: <PatientManageFollowUp/>,
    },
    {
      path: "/patient/pay/appointment/:appid",
      element: <PatientPayAppointment />,
    },
    {
      path: "/auth/changepassword",
      element: <ChangePassword />,
    },
    {
      path: "/auth/resetpassword",
      element: <ResetPassword />,
    },
    {
      path: "/doctor/addHealthRecords",
      element: <AddHealthRecords />,
    },
    {
      path: "/doctor/prescriptions/:id/prescriptionDownload",
      element: <DoctorDownloadPdf />,
    },
    {
      path: "/patient/prescriptions/:id/prescriptionDownload",
      element: <PatientDownloadPdf />,
    },
    {
      path: "/patient/bookAppointment/:id",
      element: <PatientBookAppointments />,
    },
    {
      path: "/patient/family/appointments/:id",
      element: <PatientViewFamilyAppointments />,
    },
    {
      path: "/doctor/reschedualAppointments/:id/:aptId",
      element: <DoctorManageRescheduaedlAppointments />,
    },
    {
      path: "/patient/bookFollowUp/:id",
      element: <PatientBookFollowUp/>,
    },
    {
      path: "/auth/changepassword",
      element: <ChangePassword />,
    },
    {
      path: "/auth/resetpassword",
      element: <ResetPassword />,
    },
    {
      path: "/auth/forgotpassword",
      element: <ForgotPassword />,
    },

    { path: "*", element: <NotFoundPage /> },

    {
      path:"/chat",
      element: <Chatpage/>
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
