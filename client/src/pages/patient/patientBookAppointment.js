import PatientBookAppointment from "../../components/ViewComponents/PatientManageAppointments";
import PatientDashboard from "./PatientDashboard";

const PatientBookAppointments = () => {
  return (
    <>
      <PatientDashboard title="Doctor details" />
      <PatientBookAppointment/>
    </>
  );
};

export default PatientBookAppointments;


