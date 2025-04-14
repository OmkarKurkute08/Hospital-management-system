// src/components/ViewPrescriptions.jsx
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import Cookies from "universal-cookie";
import "../components/ViewPrescription.css"; // Reusing the CSS

const ViewPrescriptions = () => {
  const cookie = new Cookies();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const { isAuthenticated, user } = useContext(Context);
  const { appointmentId } = useParams(); // Get appointmentId from URL params

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!appointmentId) {
        // Handle the case where appointmentId is missing (e.g., redirect)
        console.warn("Appointment ID is missing.  Cannot fetch prescriptions.");
        setPrescriptions([]); // Or set to an error state
        return;
      }

      try {
        const token = cookie.get("token");
        const { data } = await axios.get(
          `http://localhost:8080/api/v1/prescriptions/${appointmentId}`, // Updated URL
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Prescriptions fetched:", data);
        setPrescriptions(data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setPrescriptions([]); // Handle errors gracefully
      }
    };

    fetchPrescriptions();
  }, [appointmentId, user.id]); // Dependency array includes appointmentId

  if (!isAuthenticated) {
    return <navigate to={"/login"} />;
  }
  if (!appointmentId) {
    return <div>Appointment ID not found.</div>; // Or a better message/redirect
  }
//   console.log(prescriptions);
  
  const handlePrintPrescription = (prescription) => {
    const printableContent = `
      <div style="width: 800px; margin: 40px auto;">
        <h2 style="text-align: center;">Prescription</h2>
        <hr />
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 10px;">Patient Information</th>
            <th style="border: 1px solid #ddd; padding: 10px;"></th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px;">Name:</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${prescription.patient.firstName+" "+prescription.patient.lastName}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px;">Date of Birth:</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${prescription.patient.dob}</td>
          </tr>
        </table>
        <br />
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 10px;">Medication Information</th>
            <th style="border: 1px solid #ddd; padding: 10px;"></th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px;">Medication:</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${prescription.medication}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px;">Dosage:</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${prescription.dosage}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px;">Instructions:</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${prescription.instructions}</td>
          </tr>
        </table>
        <br />
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 10px;">Doctor Information</th>
            <th style="border: 1px solid #ddd; padding: 10px;"></th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px;">Name:</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${prescription.doctor.firstName + " " + prescription.doctor.lastName}</td>
          </tr>
        </table>
        <br />
        <p style="text-align: center;">Prescribed Date: ${new Date(prescription.prescribedAt).toLocaleString()}</p>
      </div>
    `;
    const style = `
      @media print {
        body {
          margin: 0;
        }
      }
    `;
    const win = window.open();
    win.document.write(`
      <html>
        <head>
          <style>
            ${style}
          </style>
        </head>
        <body>
          ${printableContent}
        </body>
      </html>
    `);
    win.print();
    win.close();
  };

  return (
    <section className="dashboard page">
      <div className="banner">
        <div className="firstBox">
          <div className="image">
            <img src="/download.png" alt="UserImg" />
          </div>
          <div className="content">
            <div>
              <p>Hello ,</p>
              <h5>{user && `${user.firstName} ${user.lastName}`}</h5>
            </div>
            <p>
              Here are your prescriptions.
            </p>
          </div>
        </div>
      </div>
      <div className="banner">
        <h5>Prescriptions</h5>
        <table>
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Instructions</th>
              <th>Doctor</th>
              <th>Prescribed Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <tr key={prescription.id}>
                  <td>{prescription.medication}</td>
                  <td>{prescription.dosage}</td>
                  <td>{prescription.instructions}</td>
                  <td>{`${prescription.doctor.firstName} ${prescription.doctor.lastName}`}</td>
                  <td>
                    {new Date(prescription.prescribedAt).toLocaleString()}
                  </td>
                  <td>
                  <button onClick={() => handlePrintPrescription(prescription)}>Print Prescription</button>
                    <div
                      id={`prescription-${prescription.id}`}
                      className="printable"
                      style={{ display: "none" }}
                    >
                      <h2>Prescription</h2>
                      <p>Medication: {prescription.medication}</p>
                      <p>Dosage: {prescription.dosage}</p>
                      <p>Instructions: {prescription.instructions}</p>
                      <p>
                        Doctor: {prescription.doctor.firstName}{" "}
                        {prescription.doctor.lastName}
                      </p>
                      <p>
                        Prescribed Date:{" "}
                        {new Date(prescription.prescribedAt).toLocaleString()}
                      </p>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No Prescriptions Found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ViewPrescriptions;