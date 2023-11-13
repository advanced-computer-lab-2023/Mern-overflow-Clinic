import PatientDashboard from "./PatientDashboard";
import PatientViewPackages from "../../components/ViewComponents/PatientViewPackages";
import PatientAddPackage from "../../components/formComponents/PatientAddPackage";
const PatientManagePackages = () => {
  return (
    <>
      <PatientDashboard title="View My Packages" />
      <PatientAddPackage />
      <PatientViewPackages />
    </>
  );
};

export default PatientManagePackages;

