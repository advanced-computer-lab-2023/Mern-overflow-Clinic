import PatientDashboard from "./PatientDashboard";
import PatientManageFamilyLinks from "../../components/formComponents/linkFamilyMembers";

const PatientLinkFamily = () => {
  return (
    <>
      <PatientDashboard title="Linking My Family Members" />
      <PatientManageFamilyLinks />
    </>
  );
};

export default PatientLinkFamily;


