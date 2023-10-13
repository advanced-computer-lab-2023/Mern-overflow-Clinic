import PatientDashboard from "./PatientDashboard";
import PatientViewDoctors from "../../components/ViewComponents/PatientViewDoctors";

const PatientManageDoctors = () => {
  return (
    <>
      <PatientDashboard title="View All Doctors" />
      <PatientViewDoctors />
    </>
  );
};

export default PatientManageDoctors;
