import './App.css';
import Register from './pages/Register';
import * as ReactDOM from "react-dom/client";
import ButtonAppBar from './components/ButtonAppBar';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/register",
      element: <Register />,
    },
  ]);
  
  return (
    <div className="App">
      <ButtonAppBar title='El7a2ni Clinic' actionButton='Sign in' />
      <RouterProvider router={router} />
      
    </div>
  );
}

export default App;
