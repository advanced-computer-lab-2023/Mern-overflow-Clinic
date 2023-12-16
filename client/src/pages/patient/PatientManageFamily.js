import PatientDashboard from "./PatientDashboard";
import FamilyMemberManagement from "../../components/formComponents/PatientManageFamily"
import { useUser } from "../../userContest";


const PatientManageFamily = () => {
  const { userRole } = useUser();

  return (
    <>
      {userRole === "Patient" ? (
        <>
          <PatientDashboard title="Manage My Family Members" />
          <FamilyMemberManagement />
        </>
      ) : (
        <p>Excuse me, are you a Patient?</p>
      )}
    </>
  );
};

export default PatientManageFamily;