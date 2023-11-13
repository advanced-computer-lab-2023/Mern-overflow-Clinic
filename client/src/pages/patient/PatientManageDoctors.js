import PatientDashboard from "./PatientDashboard";
import PatientViewDoctors from "../../components/ViewComponents/PatientViewDoctors";
import { useUser } from "../../userContest";

const PatientManageDoctors = () => {
  const { userId, setUserId, userRole, setUserRole } = useUser();
  return (
    <>
      {userRole === "Patient" ? (
        <>
          <PatientDashboard title="View All Doctors" />
          <PatientViewDoctors />
        </>
      ) : (
        <p>Excuse me, are you a Patient?</p>
      )}
    </>
  );
};

export default PatientManageDoctors;
