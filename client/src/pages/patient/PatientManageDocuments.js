import PatientDashboard from "./PatientDashboard";
import PatientViewDocuments from "../../components/ViewComponents/PatientViewDocuments";
const PatientManageDocuments = () => {
  return (
    <>
      <PatientDashboard title="View My Documents" />
      <PatientViewDocuments />
    </>
  );
};

export default PatientManageDocuments;

