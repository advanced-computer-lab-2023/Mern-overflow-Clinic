import PatientDashboard from "./PatientDashboard";
import PatientViewPrescriptions from "../../components/ViewComponents/PatientViewPrescriptions";
const PatientManagePrescriptions = () => {
  return (
    <>
      <PatientDashboard title="View My Prescriptions" />
      <PatientViewPrescriptions />
    </>
  );
};

export default PatientManagePrescriptions;

