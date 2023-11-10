import PatientDashboard from "./PatientDashboard";
import AddFamilyMember from "../../components/formComponents/AddFamilyMember";
import PatientViewFamilyMembers from "../../components/ViewComponents/PatientViewFamilyMembers";
import { useUser } from '../../userContest';
const PatientManageFamily = () => {
  const { userId } = useUser();
  return (
    <>
      <PatientDashboard title="Manage My Family Members" />
      <AddFamilyMember userId={userId}/>
      <PatientViewFamilyMembers />
    </>
  );
};

export default PatientManageFamily;
