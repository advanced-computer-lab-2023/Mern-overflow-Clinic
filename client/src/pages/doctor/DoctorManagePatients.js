import DoctorDashboard from "./DoctorDashboard";
import DoctorViewPatients from "../../components/ViewComponents/DoctorViewPatients";
import { useUser } from "../../userContest";

const DoctorManagePatients = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Doctor" ? (
        <>
          <DoctorDashboard title="Manage My Patients" />
          <DoctorViewPatients />
        </>
      ) : (
        <p>Excuse me, are you a Doctor?</p>
      )}
    </>
  );
};

export default DoctorManagePatients;
