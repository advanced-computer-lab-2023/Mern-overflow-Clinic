import DoctorAddFreeSLots from "../../components/formComponents/AddSlots";
import DoctorDashboard from "./DoctorDashboard";
import { useUser } from "../../userContest";

const DoctorManageFreeSlots = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Doctor" ? (
        <>
          <DoctorDashboard title="Add Free Slots" />
          <DoctorAddFreeSLots />
        </>
      ) : (
        <p>Excuse me, are you a Doctor?</p>
      )}
    </>
  );
};

export default DoctorManageFreeSlots;
