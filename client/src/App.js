import './App.css';

import * as ReactDOM from "react-dom/client";
import ButtonAppBar from './components/ButtonAppBar';
import PatientSignUp from './pages/PatientSignUp';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/register",
      element: <PatientSignUp />,
    },
  ]);

  return (
    <div className="App">
      <PatientSignUp />
      <ButtonAppBar title='El7a2ni Clinic' actionButton='Sign in' />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
