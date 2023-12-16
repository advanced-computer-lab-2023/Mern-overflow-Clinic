import DoctorDashboard from "./DoctorDashboard";
import DoctorViewPrescriptionDetails from "../../components/ViewComponents/DoctorViewPrescriptionDetails";
import { useUser } from "../../userContest";
const DoctorManagePrescriptionDetails = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Doctor" ? (
        <>
          <DoctorDashboard title="View My Prescriptions" />
          <DoctorViewPrescriptionDetails />
        </>
      ) : (
        <p>Excuse me, are you a Doctor?</p>
      )}
    </>
  );
};

export default DoctorManagePrescriptionDetails;
