import DoctorViewAppointments from "../../components/ViewComponents/DoctorViewAppointments";
import DoctorDashboard from "./DoctorDashboard";
import { useUser } from "../../userContest";

const DoctorManageAppointments = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Doctor" ? (
        <>
          <DoctorDashboard title="Manage My Appointments" />
          <DoctorViewAppointments />
        </>
      ) : (
        <p>Excuse me, are you a Doctor?</p>
      )}
    </>
  );
};

export default DoctorManageAppointments;
