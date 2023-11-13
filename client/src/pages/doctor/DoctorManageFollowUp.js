import DoctorDashboard from "./DoctorDashboard";
import ScheduleFollowUp from "../../components/formComponents/ScheduleFollowUp";
import { useUser } from "../../userContest";

const DoctorManageFollowUp = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Doctor" ? (
        <>
          <DoctorDashboard title="Manage My Contracts" />
          <ScheduleFollowUp />
        </>
      ) : (
        <p>Excuse me, are you a Doctor?</p>
      )}
    </>
  );
};

export default DoctorManageFollowUp;

