import DoctorDashboard from "./DoctorDashboard";
import AddPrescription from "../../components/formComponents/AddPrescription";
import DoctorViewPrescriptions from "../../components/ViewComponents/DoctorViewPrescriptions";
import { useUser } from "../../userContest";
import { useState } from "react";
import { Container, Grid } from "@mui/material";
const DoctorManagePrescriptions = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  const [dataIsUpdated, setDataIsUpdated] = useState(true);
  return (
    <>
      {userRole === "Doctor" ? (
        <>
          <DoctorDashboard title="View My Prescriptions" />
          <Container sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Grid container spacing={10} sx={{ width: '100%' }}>
              <AddPrescription setDataIsUpdated= {setDataIsUpdated} />
              <DoctorViewPrescriptions dataIsUpdated= {dataIsUpdated} setDataIsUpdated={setDataIsUpdated} />
            </Grid>
          </Container>
        </>
      ) : (
        <p>Excuse me, are you a Doctor?</p>
      )}
    </>
  );
};

export default DoctorManagePrescriptions;
