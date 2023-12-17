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
          <DoctorViewInfo sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', 
                                margin: '5em -7.5em 5em 5em', width: '125%', position: 'sticky', maxHeight: '70vh',
                                overflow: 'auto', border: '1px solid #ccc', borderRadius: '0.8em',
                                '::-webkit-scrollbar': {width: '12px'}, '::-webkit-scrollbar-thumb': {backgroundColor: '#888', borderRadius: '6px'},
                                '::-webkit-scrollbar-track': {backgroundColor: '#eee', borderRadius: '8px'} }} />
        </>
      ) : (
        <p>Excuse me, are you a Doctor?</p>
      )}
    </>
  );
};
export default DoctorManageInfo;

