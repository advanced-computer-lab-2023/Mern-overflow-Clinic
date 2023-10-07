import './App.css';
import * as ReactDOM from "react-dom/client";
import ButtonAppBar from './components/ButtonAppBar';
import PatientRegister from './pages/authentication/PatientRegister';
import DoctorRegister from './pages/authentication/DoctorRegister';
import SignIn from './pages/authentication/SignIn';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AdminDashbaord from './pages/admin/AdminDashboard';

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
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />

    </div>
  );
}

export default App;