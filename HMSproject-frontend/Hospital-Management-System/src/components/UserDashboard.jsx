import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import "../components/UserDashboard.css";
import Cookies from "universal-cookie";

const UserDashboard = () => {
  const cookie = new Cookies();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [show, setShow] = useState(false);
  const { isAuthenticated, user } = useContext(Context); // Get user from context
  const [loading, setLoading] = useState(true);  // Add a loading state
  const [totalDoctors, setTotalDoctors] = useState(0); // Add a state to store total doctors

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true); // Start loading

      try {
        const token = cookie.get("token");
        const { data } = await axios.get(
          `http://localhost:8080/api/v1/appointment/user/${user.id}/all`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppointments(data);
      } catch (error) {
        setAppointments([]);
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false); // Stop loading, regardless of success/failure
      }
    };

    const fetchTotalDoctors = async () => {
      try {
        const token = cookie.get("token");
        const { data } = await axios.get(
          `http://localhost:8080/api/v1/user/doctors/count`, // API endpoint to fetch total doctors
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalDoctors(data.count); // Assuming the API returns a count property
      } catch (error) {
        console.error("Error fetching total doctors:", error);
      }
    };

    if (user && user.id) {  // Make sure user is available
      fetchAppointments();
      fetchTotalDoctors(); // Fetch total doctors
    } else {
      setLoading(false); // If user is not available, stop loading
    }
  }, [user]); // Add user to the dependency array

  const handlePrescribeMedicine = (appointmentId) => {
    navigate(`/prescriptions/${appointmentId}`);
  };

  const handleReschedule = (appointmentId) => {
    navigate(`/rescheduleAppointment/${appointmentId}`);
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  if (loading) {
    return <div>Loading appointments...</div>; // Or any other loading indicator
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <div className="image">
              <img src="/download.png" alt="UserImg" />
            </div>
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>{user && `${user.firstName} ${user.lastName}`} </h5>
              </div>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Facilis, nam molestias. Eaque molestiae ipsam commodi neque.
                Assumenda repellendus necessitatibus itaque.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{appointments.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>{totalDoctors}</h3>
          </div>
        </div>
        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead style={{textAlign : "center"}}>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
                <th>Prescription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody style={{textAlign : "center"}}>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{`${appointment.patient.firstName} ${appointment.patient.lastName}`}</td>
                    <td>
                      {new Date(appointment.appointmentDate).toLocaleString()}
                    </td>
                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td>{appointment.department}</td>
                    <td>
                      <h6
                        className={
                          appointment.status === "Pending"
                            ? "value-pending"
                            : appointment.status === "Accepted"
                            ? "value-accepted"
                            : "value-rejected"
                        }
                        value={appointment.status || "Pending"}
                      >
                        {appointment.status || "Pending"}
                      </h6>
                    </td>
                    <td>
                      {appointment.hasVisited ? (
                        <GoCheckCircleFill className="green" />
                      ) : (
                        <AiFillCloseCircle className="red" />
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handlePrescribeMedicine(appointment.id)}
                      >
                        View Prescription
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleReschedule(appointment.id)}
                      >
                        Reschedule Appointment
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No Appointments Found!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default UserDashboard;