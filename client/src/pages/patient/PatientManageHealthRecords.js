import PatientDashboard from "./PatientDashboard";
import HealthRecordsPage from "../../components/ViewComponents/PatientViewHealthRecords";
import { useUser } from "../../userContest";


const PatientManageHealthRecords= () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Patient" ? (
        <>
          <PatientDashboard title="My Health Records" />
          <HealthRecordsPage />
        </>
      ) : (
        <p>Excuse me, are you a Patient?</p>
      )}
    </>
  );
};

export default PatientManageHealthRecords;
