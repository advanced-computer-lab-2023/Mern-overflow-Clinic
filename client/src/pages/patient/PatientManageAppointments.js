import PatientDashboard from "./PatientDashboard";
import PatientViewAppointments from "../../components/ViewComponents/PatientViewAppointments";
import { useUser } from "../../userContest";

const PatientManageAppointments = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Patient" ? (
        <>
          <PatientDashboard title="Manage My Appointments" />
          <PatientViewAppointments />
        </>
      ) : (
        <p>Excuse me, are you a Patient?</p>
      )}
    </>
  );
};

export default PatientManageAppointments;
