import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import Cookies from "universal-cookie";

const Dashboard = () => {
  const cookie = new Cookies();
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      const token = cookie.get("admin-token");

      try {
        // Fetch appointments
        const appointmentsResponse = await axios.get(
          "http://localhost:8080/api/v1/user/admin/appointment/all",
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAppointments(appointmentsResponse.data);
        setTotalAppointments(appointmentsResponse.data.length);

        // Fetch total doctor count
        const doctorsCountResponse = await axios.get(
          "http://localhost:8080/api/v1/user/admin/doctors/count",
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTotalDoctors(doctorsCountResponse.data.count);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          error.response?.data?.message ||
            "Error fetching data. Please try again."
        );
        setAppointments([]);
        setTotalDoctors(0);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const token = cookie.get("admin-token");
      const { data } = await axios.put(
        `http://localhost:8080/api/v1/user/admin/updateStatus/${appointmentId}?status=${status}`,
        {}, // Empty body since status is a query parameter
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  // console.log(admin);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
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
              <h5><u>{admin && `${admin}`}</u></h5>
            </div>
            <p>Welcome to the admin dashboard for managing appointments.</p>
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
                      onChange={(e) =>
                        handleUpdateStatus(appointment.id, e.target.value)
                      }
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No Appointments Found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Dashboard;