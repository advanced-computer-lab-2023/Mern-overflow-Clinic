import DoctorDashboard from "./DoctorDashboard";
import EditDoctorProfile from "../../components/formComponents/EditDoctorProfile";
import { useUser } from "../../userContest";

const DoctorManageProfile = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Doctor" ? (
        <>
          <DoctorDashboard title="Manage My Profile" />
          <EditDoctorProfile />
        </>
      ) : (
        <p>Excuse me, are you a Doctor?</p>
      )}
    </>
  );
};

export default DoctorManageProfile;
