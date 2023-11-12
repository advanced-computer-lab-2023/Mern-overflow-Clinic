import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { useUser } from "../../userContest";
import axios from "axios";

const ContractPage = ({ match }) => {
  axios.defaults.withCredentials = true;
  const { userId } = useUser();
  let id = userId;
  const [contracts, setContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fetchContracts = () => {
    // Fetch contract data from your backend API using the `match.params.id`.
    axios.get(`http://localhost:8000/contracts/${id}`)
      .then((data) => {
        setContracts(data.data)
      })
      .catch((error) => {
        setErrorMessage("Error fetching contract data");
        console.error("Error fetching contract data:", error);
      });
  };
  useEffect(() => {
    fetchContracts();
  }, [id]);

  const formatMarkup = (value) => {
    return value + "%";
  };

  const formatDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleAccept = async () => {
    if (selectedContractId) {
      try {
        // Immediately update the status to 'accepting'
        const updatedContracts = contracts.map((contract) => {
          if (contract._id === selectedContractId) {
            contract.status = "accepted";
          }
          return contract;
        });
        setContracts(updatedContracts);

        const response = await axios.put(`http://localhost:8000/doctors/${id}/acceptContract`,JSON.stringify({ contractId: selectedContractId }));

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSuccessMessage("Contract accepted successfully");
            fetchContracts();
          } else {
            setErrorMessage("Error accepting contract 1");
          }
        } else {
          setErrorMessage(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        setErrorMessage(`Error accepting contract 2: ${error}`);
        console.error("Error accepting contract:", error);
      }
    }
  };

  const handleReject = async () => {
    if (selectedContractId) {
      try {
        // Immediately update the status to 'rejecting'
        const updatedContracts = contracts.map((contract) => {
          if (contract._id === selectedContractId) {
            contract.status = "rejected";
          }
          return contract;
        });
        setContracts(updatedContracts);

        const response = await axios.put(`http://localhost:8000/doctors/${id}/rejectContract`,JSON.stringify({ contractId: selectedContractId }));

        if (response.status === 200) {
          const data = await response.json();
          if (data.success) {
            setSuccessMessage("Contract rejected successfully");
            fetchContracts();
          } else {
            setErrorMessage("Error rejecting contract");
          }
        } else {
          setErrorMessage(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        setErrorMessage("Error rejecting contract");
        console.error("Error rejecting contract:", error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Doctor's Contracts</h1>
      {successMessage && (
        <div style={styles.successMessage}>{successMessage}</div>
      )}
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      <table style={styles.contractTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Clinic Markup</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => (
            <tr key={contract._id} style={styles.contractRow}>
              <td>{formatDate(contract.date)}</td>
              <td>{formatMarkup(contract.clinicMarkup)}</td>
              <td>{contract.status}</td>
              <td>
                {contract.status === "pending" ? (
                  <>
                    <button
                      style={styles.acceptButton}
                      onClick={() => {
                        setSelectedContractId(contract._id);
                        handleAccept();
                      }}
                    >
                      Accept
                    </button>
                    <button
                      style={styles.rejectButton}
                      onClick={() => {
                        setSelectedContractId(contract._id);
                        handleReject();
                      }}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button style={styles.acceptButtonDimmed} disabled>
                      Accept
                    </button>
                    <button style={styles.rejectButtonDimmed} disabled>
                      Reject
                    </button>
                  </>
                )}
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
  contractTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  contractRow: {
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
  acceptButtonDimmed: {
    backgroundColor: "lightgreen",
    color: "white",
    padding: "5px 10px",
    border: "none",
    cursor: "not-allowed",
    marginRight: "5px",
  },
  rejectButtonDimmed: {
    backgroundColor: "lightcoral",
    color: "white",
    padding: "5px 10px",
    border: "none",
    cursor: "not-allowed",
  },
  successMessage: {
    backgroundColor: "lightgreen",
    padding: "1rem",
    margin: "1rem",
  },
  errorMessage: {
    backgroundColor: "lightcoral",
    padding: "1rem",
    margin: "1rem",
  },
};

export default ContractPage;
