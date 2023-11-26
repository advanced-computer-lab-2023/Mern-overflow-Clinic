import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from '../../userContest';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const HealthRecordsPage = ({ match }) => {
  const { userId } = useUser();
  const patientId = userId;

  const [healthRecords, setHealthRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchHealthRecords = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/patients/${patientId}/healthRecords`);
      setHealthRecords(response.data || []);
    } catch (error) {
      setErrorMessage("Error fetching health records");
      console.error("Error fetching health records:", error);
    }
  };

  useEffect(() => {
    fetchHealthRecords();
  }, [patientId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={styles.container}>
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      <table style={styles.healthRecordsTable}>
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Date</th>
            <th>Diagnosis</th>
          </tr>
        </thead>
        <tbody>
          {healthRecords.map((record, index) => (
            <tr key={index} style={styles.recordRow}>
              <td>{record.doctor}</td>
              <td>{formatDate(record.date)}</td>
              <td>{record.diagnosis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    margin: "20px",
  },
  header: {
    fontSize: "1.5rem",
  },
  healthRecordsTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  recordRow: {
    borderTop: "15px solid transparent",
  },
  errorMessage: {
    backgroundColor: "lightcoral",
    padding: "1rem",
    margin: "1rem",
  },
};

export default HealthRecordsPage;
