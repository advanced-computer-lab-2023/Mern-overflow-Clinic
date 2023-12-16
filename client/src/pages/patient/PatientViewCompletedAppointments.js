// import PatientBookAppointment from "../../components/ViewComponents/PatientManageFollowUp";
// import PatientDashboard from "./PatientDashboard";

// const PatientManageFollowUp = () => {
//   return (
//     <>
//       <PatientDashboard title="Book A Follow Up" />
//       <PatientManageFollowUps/>
//     </>
//   );
// };

// export default PatientManageFollowUp;


// import PatientDashboard from "./PatientDashboard";
// import PatientViewDoctors from "../../components/ViewComponents/PatientViewDoctors";
// import { useUser } from "../../userContest";

// const PatientManageDoctors = () => {
//   const { userId, setUserId, userRole, setUserRole } = useUser();
//   return (
//     <>
//       {userRole === "Patient" ? (
//         <>
//           <PatientDashboard title="View All Doctors" />
//           <PatientViewDoctors />
//         </>
//       ) : (
//         <p>Excuse me, are you a Patient?</p>
//       )}
//     </>
//   );
// };

// export default PatientManageDoctors;

import PatientDashboard from "./PatientDashboard";
import PatientViewCompletedAppointments from "../../components/ViewComponents/PatientViewCompletedAppointments";
import { useUser } from "../../userContest";

const PatientManageFollowUp = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Patient" ? (
        <>
          <PatientDashboard title="Request A follow Up" />
          <PatientViewCompletedAppointments />
        </>
      ) : (
        <p>Excuse me, are you a Patient?</p>
      )}
    </>
  );
};

export default PatientManageFollowUp;
