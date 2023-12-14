import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../userContest";

const FollowUpPage = ({ match }) => {
  const { userId } = useUser();
  let id = userId;
  const [pendingFollowUps, setPendingFollowUps] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchPendingFollowUps = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/appointments/pendingFollowUps/${id}`);
      setPendingFollowUps(response.data || []);
    } catch (error) {
      setErrorMessage("Error fetching pending follow-ups");
      console.error("Error fetching pending follow-ups:", error);
    }
  };

  useEffect(() => {
    fetchPendingFollowUps();
  }, [id]);

  const handleAcceptReject = async (followUpId, action) => {
    try {
      // Call the API endpoint based on the action (accept or reject)
      await axios.put(`http://localhost:8000/doctors/${id}/${action}FollowUp`, {
        appointmentId: followUpId,
      });

      // Fetch updated data after accepting or rejecting the follow-up
      fetchPendingFollowUps();
    } catch (error) {
      // Handle errors if needed
      console.error(`Error ${action.toLowerCase()}ing follow-up:`, error);
    }
  };

  const formatDate = (date) => {
    // Format your date as needed
    return new Date(date).toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Pending Follow-ups</h1>
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      <table style={styles.followUpTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingFollowUps.map((followUp, index) => (
            <tr key={followUp._id} style={styles.followUpRow}>
              <td>{formatDate(followUp.date)}</td>
              <td>
                <button
                  style={styles.acceptButton}
                  onClick={() => handleAcceptReject(followUp._id, "Accept")}
                >
                  Accept
                </button>
                <button
                  style={styles.rejectButton}
                  onClick={() => handleAcceptReject(followUp._id, "Reject")}
                >
                  Reject
                </button>
              </td>
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
  followUpTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  followUpRow: {
    borderTop: "15px solid transparent",
  },
  acceptButton: {
    backgroundColor: "green",
    color: "white",
    padding: "5px 10px",
    border: "none",
    cursor: "pointer",
    marginRight: "5px",
    transition: "background-color 0.3s",
  },
  rejectButton: {
    backgroundColor: "red",
    color: "white",
    padding: "5px 10px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  errorMessage: {
    backgroundColor: "lightcoral",
    padding: "1rem",
    margin: "1rem",
  },
};

export default FollowUpPage;
