import DoctorDashboard from "./DoctorDashboard";
import DoctorViewPatients from "../../components/ViewComponents/DoctorViewPatients";

const DoctorManagePatients = () => {
  return (
    <>
      <DoctorDashboard title="Manage My Patients" />
      <DoctorViewPatients />
    </>
  );
};

export default DoctorManagePatients;

