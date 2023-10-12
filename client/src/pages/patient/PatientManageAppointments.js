import PatientDashboard from "./PatientDashboard";
import PatientViewAppointments from "../../components/ViewComponents/PatientViewAppointments";

const PatientManageAppointments = () => {
  return (
    <>
      <PatientDashboard title="Manage My Appointments" />
      <PatientViewAppointments />
    </>
  );
};

export default PatientManageAppointments;

