import DoctorDashboard from "./DoctorDashboard";
import DoctorAcceptOrRejectContract from "../../components/formComponents/DoctorAcceptOrRejectFollowUp";
import { useUser } from "../../userContest";

const DoctorManageFollowUps = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Doctor" ? (
        <>
          <DoctorDashboard title="Manage My Contracts" />
          <DoctorAcceptOrRejectContract />
        </>
      ) : (
        <p>Excuse me, are you a Doctor?</p>
      )}
    </>
  );
};

 export default DoctorManageFollowUps;

// import DoctorDashboard from "./DoctorDashboard";
// import DoctorAcceptOrRejectContract from "../../components/formComponents/DoctorAcceptOrRejectContract";
// import { useUser } from "../../userContest";

// const DoctorManageContracts = () => {
//   const { userId, setUserId, userRole, setUserRole } = useUser();
//   return (
//     <>
//       {userRole === "Doctor" ? (
//         <>
//           <DoctorDashboard title="Manage My Contracts" />
//           <DoctorAcceptOrRejectContract />
//         </>
//       ) : (
//         <p>Excuse me, are you a Doctor?</p>
//       )}
//     </>
//   );
// };

// export default DoctorManageContracts;

