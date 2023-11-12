import { useState } from "react";
import PatientDashboard from "./PatientDashboard";
import PatientPayMethod from "../../components/ViewComponents/PatientPayMethod";
import { useParams } from 'react-router-dom';

const PatientPayAppointment = () => {
    const [paymentMethod, setPaymentMethod] = useState("");
    const { appid } = useParams();
    
    return (
        <>
            <PatientDashboard title= {`Pay Appointment`} />
            <PatientPayMethod setPaymentMethod={setPaymentMethod} paymentMethod={paymentMethod} appid={appid} />
        </>
    );
}

export default PatientPayAppointment;