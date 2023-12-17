import React from 'react';
import NotFoundImg from "./assets/photos/not-found.png"
import { IconButton, Button } from "@mui/material";
import { Link } from 'react-router-dom';
import { useUser } from "./userContest.js";

export default function NotFoundPage() {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      <div>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you're looking for does not exist.</p>
        <img src={NotFoundImg} />
      </div>
      <Button variant="contained" component={Link}
        to={(userRole == "Patient")? "/patient/info" : (userRole == "Doctor")? "/doctor/info" : "/admin/admins"}>
           Return to Homepage </Button>
    </>
  );
};
