import './App.css';
import PatientRegister from './pages/authentication/PatientRegister';
import DoctorRegister from './pages/authentication/DoctorRegister';
import SignIn from './pages/authentication/SignIn';
import AdminDashbaord from './pages/admin/AdminDashboard';
import AdminManageAdmins from './pages/admin/AdminManageAdmins';
import AdminManageDoctors from './pages/admin/AdminManageDoctors';
import AdminManagePatients from './pages/admin/AdminManagePatients';
import AdminManagePackages from './pages/admin/AdminManagePackages';
import AdminManageDoctorRequests from './pages/admin/AdminManageDoctorRequests';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/register/patient",
      element: <PatientRegister />,
    },
    {
      path: "/register/doctor",
      element: <DoctorRegister />,
    },
    {
      path: "/signin",
      element: <SignIn />,
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
      path: "/admin/doctor-requests",
      element: <AdminManageDoctorRequests />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />

    </div>
  );
}

export default App;