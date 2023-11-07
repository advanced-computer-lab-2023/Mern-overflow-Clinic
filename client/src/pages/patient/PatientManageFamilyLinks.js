import PatientDashboard from "./PatientDashboard";
import PatientManageFamilyLinks from "../../components/formComponents/linkFamilyMembers";

const PatientLinkFamily = () => {
  return (
    <>
      <PatientDashboard title="Linking My Family Members" />
      <PatientManageFamilyLinks />
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