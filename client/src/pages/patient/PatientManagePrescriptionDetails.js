import PatientDashboard from "./PatientDashboard";
import PatientViewPrescriptionDetails from "../../components/ViewComponents/PatientViewPrescriptionDetails";
import { useUser } from "../../userContest";
const PatientManagePrescriptionDetails = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Patient" ? (
        <>
          <PatientDashboard title="View My Prescriptions" />
          <PatientViewPrescriptionDetails />
        </>
      ) : (
        <p>Excuse me, are you a Patient?</p>
      )}
    </>
  );
};

export default PatientManagePrescriptionDetails;
