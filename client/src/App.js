import './App.css';
import * as ReactDOM from "react-dom/client";
import ButtonAppBar from './components/ButtonAppBar';
import PatientRegister from './pages/authentication/PatientRegister';
import DoctorRegister from './pages/authentication/DoctorRegister';
import Register from './pages/authentication/Register';
import SignIn from './pages/authentication/SignIn';

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
      path: "/temp",
      element: <Register />,
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />

    </div>
  );
}

export default App;