import PatientDashboard from "./PatientDashboard";
import PatientViewInfo from "../../components/ViewComponents/PatientViewInfo";
import { useUser } from "../../userContest";



const PatientManageInfo = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Patient" ? (
        <>
          <PatientDashboard title="My Information" />
          <PatientViewInfo />
        </>
      ) : (
        <p>Excuse me, are you a Patient?</p>
      )}
    </>
  );
};
export default PatientManageInfo;
