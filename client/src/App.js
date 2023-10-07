import './App.css';
import * as ReactDOM from "react-dom/client";
import ButtonAppBar from './components/ButtonAppBar';
import PatientRegister from './pages/authentication/PatientRegister';
import DoctorRegister from './pages/authentication/DoctorRegister';
import SignIn from './pages/authentication/SignIn';
import AdminDashbaord from './pages/admin/AdminDashboard';
import AdminManageAdmins from './pages/admin/AdminManageAdmins';
import AdminManageDoctors from './pages/admin/AdminManageDoctors';
import AdminManagePatients from './pages/admin/AdminManageAdmins';
import AdminManagePackages from './pages/admin/AdminManagePackages';

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
      path: "/admin",
      element: <AdminDashbaord />,
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
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />

    </div>
  );
}

export default App;