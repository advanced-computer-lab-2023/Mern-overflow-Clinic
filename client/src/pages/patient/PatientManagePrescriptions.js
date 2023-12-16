import PatientDashboard from "./PatientDashboard";
import PatientViewPrescriptions from "../../components/ViewComponents/PatientViewPrescriptions";
import { useUser } from "../../userContest";
const PatientManagePrescriptions = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Patient" ? (
        <>
          <PatientDashboard title="View My Prescriptions" sx={{ position: 'fixed', width: '100%' }} />
          <PatientViewPrescriptions />
        </>
      ) : (
        <p>Excuse me, are you a Patient?</p>
      )}
    </>
  );
};

export default PatientManagePrescriptions;
