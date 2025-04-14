import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import Cookies from "universal-cookie";

// Import Context
import { Context } from "../main";

const Dashboard = () => {
  const cookie = new Cookies();
  const navigate = useNavigate();
  const { isAuthenticated, doctor } = useContext(Context);

  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch appointments and doctor count on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading

      try {
        const token = cookie.get("doctor-token");

        // Fetch appointments
        const appointmentsResponse = await axios.get(
          `http://localhost:8080/api/v1/user/doctor/appointments/${doctor.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const appointmentsData = appointmentsResponse.data;
        setAppointments(appointmentsData);
        setTotalAppointments(appointmentsData.length);

        // Fetch total doctors count
        const doctorsCountResponse = await axios.get(
          `http://localhost:8080/api/v1/user/doctor/doctors/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotalDoctors(doctorsCountResponse.data.count);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          error.response?.data?.message || "Error fetching data. Please try again."
        );
        setAppointments([]); // Ensure appointments are reset in case of error
        setTotalDoctors(0); // Ensure totalDoctors is reset in case of error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (doctor && doctor.id) {
      fetchData();
    }
  }, [doctor]);

  // Handle status update
  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const token = cookie.get("doctor-token");
      await axios.put(
        `http://localhost:8080/api/v1/user/doctor/updateStatus/${appointmentId}?status=${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, status } : appointment
        )
      );
      toast.success("Status updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

  // Navigate to prescription page
  const handlePrescribeMedicine = (appointmentId) => {
    navigate(`/prescription/${appointmentId}`);
  };

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div>Loading...</div>; // Simple loading indicator
  }

  return (
    <section className="dashboard page">
      <div className="banner">
        <div className="firstBox">
          <img src="/doc.png" alt="docImg" />
          <div className="content">
            <div>
              <p></p>
              <h5><u>{doctor && `${doctor.firstName}, ${doctor.lastName}`}</u></h5>
            </div>
            <p>Welcome to the doctor dashboard for managing appointments.</p>
          </div>
        </div>
        <div className="secondBox">
          <p>Total Appointments</p>
          <h3>{totalAppointments}</h3>
        </div>
        <div className="thirdBox">
          <p>Registered Doctors</p>
          <h3>{totalDoctors}</h3>
        </div>
      </div>
      <div className="banner">
        <h5>Appointments</h5>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Status</th>
              <th>Visited</th>
              <th>Prescribe Medicine</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{`${appointment.patient.firstName} ${appointment.patient.lastName}`}</td>
                  <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                  <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                  <td>{appointment.department}</td>
                  <td>
                    <select
                      className={
                        appointment.status === "Pending"
                          ? "value-pending"
                          : appointment.status === "Accepted"
                          ? "value-accepted"
                          : "value-rejected"
                      }
                      value={appointment.status || "Pending"}
                      onChange={(e) => handleUpdateStatus(appointment.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td>
                    {appointment.hasVisited ? (
                      <GoCheckCircleFill className="green" />
                    ) : (
                      <AiFillCloseCircle className="red" />
                    )}
                  </td>
                  <td>
                    <button onClick={() => handlePrescribeMedicine(appointment.id)}>
                      Prescribe Medicine
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No Appointments Found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Dashboard;