import DoctorDashboard from "./DoctorDashboard";
import DoctorViewInfo from "../../components/ViewComponents/DoctorViewInfo";
import { useUser } from "../../userContest";

const DoctorManageInfo = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Doctor" ? (
        <>
          <DoctorDashboard title="My Information" />
          <DoctorViewInfo />
        </>
      ) : (
        <p>Excuse me, are you a Doctor?</p>
      )}
    </>
  );
};
export default DoctorManageInfo;

