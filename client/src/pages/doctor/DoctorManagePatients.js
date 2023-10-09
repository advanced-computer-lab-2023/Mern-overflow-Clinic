import DoctorDashbaord from "./DoctorDashboard";
import DoctorViewPatients from "../../components/ViewComponents/DoctorViewPatients";

const DoctorManagePatients = () => {
  return (
    <>
      <DoctorDashbaord title="Manage My Patients" />
      <DoctorViewPatients />
    </>
  );
};

export default DoctorManagePatients;

