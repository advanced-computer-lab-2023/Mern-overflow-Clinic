import PatientDashboard from "./PatientDashboard";
import ViewAppointments from "../../components/ViewComponents/ViewAppointments";

const PatientViewFamilyAppointments = () => {
  return (
    <>
      <PatientDashboard title="Family Member Appointments" />
      <ViewAppointments/>
    </>
  );
};

export default PatientViewFamilyAppointments;


