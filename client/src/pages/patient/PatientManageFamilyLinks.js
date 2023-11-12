import PatientDashboard from "./PatientDashboard";
import PatientManageFamilyLinks from "../../components/formComponents/linkFamilyMembers";
import { useUser } from "../../userContest";

const PatientLinkFamily = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Patient" ? (
        <>
          <PatientDashboard title="Link My Family Members" />
          <PatientManageFamilyLinks />
        </>
      ) : (
        <p>Excuse me, are you a Patient?</p>
      )}
    </>
  );
};

export default PatientLinkFamily;

// import PatientDashboard from "./PatientDashboard";
// import PatientViewInfo from "../../components/ViewComponents/PatientViewInfo";

// const PatientManageInfo = () => {
//  return (
//     <>
//         <PatientDashboard title="My Information" />
//         <PatientViewInfo />
//     </>
//  );
// }
// export default PatientManageInfo;

