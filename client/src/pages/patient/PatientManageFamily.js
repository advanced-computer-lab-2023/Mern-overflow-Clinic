import PatientDashboard from "./PatientDashboard";
import AddFamilyMember from "../../components/formComponents/AddFamilyMember";
import PatientViewFamilyMembers from "../../components/ViewComponents/PatientViewFamilyMembers";

const PatientManageFamily = () => {
  return (
    <>
      <PatientDashboard title="Manage My Family Members" />
      <AddFamilyMember />
      <PatientViewFamilyMembers />
    </>
  );
};

export default PatientManageFamily;
