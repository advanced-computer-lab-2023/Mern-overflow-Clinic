import DoctorDashbaord from "./DoctorDashboard";
import DoctorAcceptOrRejectContract from "../../components/formComponents/DoctorAcceptOrRejectContract";


const DoctorManageContracts = () => {
    return (
      <>
        <DoctorDashbaord title="Manage My Contracts" />
        <DoctorAcceptOrRejectContract />
      </>
    );
  };
  
  export default DoctorManageContracts;
  