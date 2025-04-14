import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams

const RescheduleAppointmentForm = () => {
  const cookie = new Cookies();
  const { appointmentId } = useParams(); // Get appointmentId from URL
  const [department, setDepartment] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [initialAppointment, setInitialAppointment] = useState(null); // State to store fetched appointment data
    const navigate = useNavigate();


  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  // Fetch appointment details on component mount (useEffect with empty dependency array)
  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) return;

      try {
        const token = cookie.get("token");
        const { data } = await axios.get(
          `http://localhost:8080/api/v1/appointment/${appointmentId}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setInitialAppointment(data);
        setDepartment(data.department);
          if (data.doctor) {
              setDoctorFirstName(data.doctor.firstName);
              setDoctorLastName(data.doctor.lastName);
          }


      } catch (error) {
        console.error("Error fetching appointment:", error);
        toast.error(
          "Error fetching appointment details: " +
            (error.response?.data?.message || error.message)
        );
        setInitialAppointment(null);
        setDepartment("");
        setDoctorFirstName("");
        setDoctorLastName("");
      }
    };

    fetchAppointment();
  }, [appointmentId]); //  appointmentId as dependency

  // Fetching doctors based on department
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!department) return; // Prevent fetching if department is not selected

      try {
        const token = cookie.get("token");
        const { data } = await axios.get(
          `http://localhost:8080/api/v1/user/doctors/${department}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDoctors(data || []); // Ensure it never sets undefined
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]); // Reset doctors to an empty array on failure
      }
    };

    fetchDoctors();
  }, [department]);

  const handleReschedule = async (e) => {
    e.preventDefault();

    // Ensure required fields are filled before proceeding
    if (!doctorFirstName || !doctorLastName || !appointmentDate) {
      toast.error(
        "Please fill out all required fields (Doctor's name and Appointment date)."
      );
      return; // Don't submit the form if any of these are missing
    }

    const appointmentData = {
      appointmentDate,
      department,
      doctorFirstName,
      doctorLastName,
    };

    try {
      const token = cookie.get("token");
      await axios.put(
        `http://localhost:8080/api/v1/appointment/reschedule/${appointmentId}`,
        appointmentData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Appointment Rescheduled Successfully!");
      // Clear form after successful submission

      setDepartment("");
      setAppointmentDate("");
      setDoctorFirstName("");
      setDoctorLastName("");
      setInitialAppointment(null); // Clear the fetched appointment data
        navigate("/profile");
    } catch (error) {
      toast.error(
        "Error rescheduling appointment: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="container form-component appointment-form">
      <h2>Reschedule Appointment</h2>
      <form onSubmit={handleReschedule}>
        <div>
            <label>Appointment ID: {appointmentId}</label>
        </div>
        <div>
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setDoctorFirstName(""); // Clear doctor selection when department changes
              setDoctorLastName("");
            }}
            required
            disabled={!appointmentId}
          >
            <option value="">Select Department</option>
            {departmentsArray.map((depart, index) => (
              <option value={depart} key={index}>
                {depart}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={
              doctorFirstName && doctorLastName
                ? `${doctorFirstName} ${doctorLastName}`
                : ""
            }
            onChange={(e) => {
              const selectedDoctor = doctors.find(
                (doctor) =>
                  `${doctor.firstName} ${doctor.lastName}` === e.target.value
              );
              if (selectedDoctor) {
                setDoctorFirstName(selectedDoctor.firstName);
                setDoctorLastName(selectedDoctor.lastName);
              }
            }}
            disabled={!department || doctors.length === 0 || !appointmentId}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={`${doctor.firstName} ${doctor.lastName}`}>
                {doctor.firstName} {doctor.lastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="date"
            placeholder="New Appointment Date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
            disabled={!appointmentId}
          />
        </div>
        <button style={{ margin: "0 auto" }} disabled={!appointmentId}>
          RESCHEDULE APPOINTMENT
        </button>
      </form>
    </div>
  );
};

export default RescheduleAppointmentForm;