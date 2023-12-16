import DoctorDashboard from "./DoctorDashboard";
import AddPrescription from "../../components/formComponents/AddPrescription";
import DoctorViewPrescriptions from "../../components/ViewComponents/DoctorViewPrescriptions";
import { useUser } from "../../userContest";
import { useState } from "react";
const DoctorManagePrescriptions = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  const [dataIsUpdated, setDataIsUpdated] = useState(true);
  return (
    <>
      {userRole === "Doctor" ? (
        <>
          <DoctorDashboard title="View My Prescriptions" />
          <AddPrescription setDataIsUpdated= {setDataIsUpdated} />
          <DoctorViewPrescriptions dataIsUpdated= {dataIsUpdated} setDataIsUpdated={setDataIsUpdated} />
        </>
      ) : (
        <p>Excuse me, are you a Doctor?</p>
      )}
    </>
  );
};

export default DoctorManagePrescriptions;
