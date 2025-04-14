// PrescriptionForm.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Use useNavigate and useParams
import axios from "axios";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";

const PrescriptionForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { appointmentId } = useParams(); // Get appointment ID from URL params
  const cookie = new Cookies();
  const [prescription, setPrescription] = useState({
    medication: "",
    dosage: "",
    instructions: "",
  });

  const [loading, setLoading] = useState(false);

const handleFormSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const token = cookie.get("doctor-token");
    const { data } = await axios.post(
      `http://localhost:8080/api/v1/user/doctor/prescribe/${appointmentId}`,
      prescription, // Directly send the prescription object
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success("Prescription sent successfully!");
    setPrescription({ medication: "", dosage: "", instructions: "" });
    navigate("/"); // Redirect to the dashboard after successful submission
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Error sending prescription"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <form className="prescription-form" onSubmit={handleFormSubmit}>
      <h3>Prescription Form</h3>
      <label>Medicine name:</label>
      <input
        type="text"
        value={prescription.medication}
        onChange={(e) =>
          setPrescription((prev) => ({
            ...prev,
            medication: e.target.value,
          }))
        }
        required
      />
      <label>Dosage:</label>
      <input
        type="text"
        value={prescription.dosage}
        onChange={(e) =>
          setPrescription((prev) => ({
            ...prev,
            dosage: e.target.value,
          }))
        }
        required
      />
      <label>Instructions:</label>
      <textarea
        rows={5}
        value={prescription.instructions}
        onChange={(e) =>
          setPrescription((prev) => ({
            ...prev,
            instructions: e.target.value,
          }))
        }
        required
      />
      <div>
        <button type="submit">Send Prescription</button>
        <button
          type="button"
          onClick={() => navigate("/")} // Navigate back to dashboard
        >
          Close
        </button>
      </div>
    </form>
  );
};

export default PrescriptionForm;