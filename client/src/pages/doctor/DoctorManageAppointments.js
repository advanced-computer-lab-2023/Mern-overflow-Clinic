import DoctorViewAppointments from "../../components/ViewComponents/DoctorViewAppointments";
import DoctorDashbaord from "./DoctorDashboard";

const DoctorManageAppointments = () => {
  return (
    <>
      <DoctorDashbaord title="Manage My Appointments" />
      <DoctorViewAppointments />
    </>
  );
};

export default DoctorManageAppointments;
