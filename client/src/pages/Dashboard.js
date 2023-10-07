import React from "react";
import { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Select,
  MenuItem,
  Button,
  Box,
  Container,
  FormControl,
  Typography,
  Divider,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import PatientView from "../components/ViewComponents/PatientView";

export default function Dashboard(props) {
  return (
    <Container>
      <PatientView />
    </Container>
  );
}
