import PatientBookAppointment from "../../components/ViewComponents/PatientManageAppointments";
import PatientDashboard from "./PatientDashboard";

const PatientBookAppointments = () => {
  return (
    <>
      <PatientDashboard title="Book An Appointment" />
      <PatientBookAppointment/>
    </>
  );
};

export default PatientBookAppointments;


