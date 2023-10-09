import PatientDashboard from "./PatientDashboard";
import AddFamilyMember from '../../components/formComponents/AddFamilyMember'

const PatientManageFamily = () => {
    return (
        <>
            <PatientDashboard title="Manage My Family Members" />
            <AddFamilyMember />
        </>
    );
}

export default PatientManageFamily;