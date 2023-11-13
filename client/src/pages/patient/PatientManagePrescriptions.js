import PatientDashboard from "./PatientDashboard";
import PatientViewPrescriptions from "../../components/ViewComponents/PatientViewPrescriptions";
import { useUser } from "../../userContest";
const PatientManagePrescriptions = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Patient" ? (
        <>
          <PatientDashboard title="View My Prescriptions" />
          <PatientViewPrescriptions />
        </>
      ) : (
        <p>Excuse me, are you a Patient?</p>
      )}
    </>
  );
};

export default PatientManagePrescriptions;
