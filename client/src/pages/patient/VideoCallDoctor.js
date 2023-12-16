import { useState } from "react";
import PatientDashboard from "./PatientDashboard";
import PatientPayMethod from "../../components/ViewComponents/PatientPayMethod";
import { json, useParams } from 'react-router-dom';

const {SpacesServiceClient} = require('@google-cloud/meet').v2beta;



const VideoCallDoctor = () => {

// Instantiates a client
    const meetClient = new SpacesServiceClient();

    async function callCreateSpace() {
  // Construct request
  const request = {};

  // Run request
  const response = await meetClient.createSpace(request);
  console.log(response);
  return response;
}

    const res = callCreateSpace();

    return (
        <>
        <PatientDashboard title= {`Video Call`} />
        <div>
            {JSON.stringify(res)}
        </div>
    </>
    );
}

export default VideoCallDoctor;