import PatientDashboard from "./PatientDashboard";
import AddFamilyMember from "../../components/formComponents/AddFamilyMember";
import PatientViewFamilyMembers from "../../components/ViewComponents/PatientViewFamilyMembers";
import { useUser } from "../../userContest";
const PatientManageFamily = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Patient" ? (
        <>
          <PatientDashboard title="Manage My Family Members" />
          <AddFamilyMember userId={userId} />
          <PatientViewFamilyMembers />
        </>
      ) : (
        <p>Excuse me, are you a Patient?</p>
      )}
    </>
  );
};

export default PatientManageFamily;
