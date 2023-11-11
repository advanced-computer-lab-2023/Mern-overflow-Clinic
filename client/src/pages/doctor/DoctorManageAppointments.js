import DoctorViewAppointments from "../../components/ViewComponents/DoctorViewAppointments";
import DoctorDashboard from "./DoctorDashboard";

const DoctorManageAppointments = () => {
  return (
    <>
      <DoctorDashboard title="Manage My Appointments" />
      <DoctorViewAppointments />
    </>
  );
};

export default DoctorManageAppointments;
