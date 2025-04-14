import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
const AppointmentForm = () => {
  const cookie = new Cookies();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("Pediatrics");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

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

  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    const fetchDoctors = async () => {
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
        console.log("Doctors fetched:", data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]); // Reset doctors to an empty array on failure
      }
    };

    if (department) fetchDoctors();
  }, [department]);

  const handleAppointment = async (e) => {
    e.preventDefault();

    // Ensure required fields are filled before proceeding
    if (!doctorFirstName || !doctorLastName || !appointmentDate) {
      toast.error(
        "Please fill out all required fields (Doctor's name and Appointment date)."
      );
      return; // Don't submit the form if any of these are missing
    }

    const appointmentData = {
      firstName,
      lastName,
      email,
      phone,
      age,
      dob,
      gender,
      appointmentDate, // Ensure this is populated
      department,
      doctorFirstName, // Ensure this is populated
      doctorLastName, // Ensure this is populated
      hasVisited: Boolean(hasVisited),
      address,
    };

    console.log("Appointment Data to Send:", appointmentData); // Log data before sending

    try {
      const token = cookie.get("token");
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/appointment/post",
        appointmentData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Appointment Book Successfully!"); // Show success message
      // Clear form after successful submission
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setAge("");
      setDob("");
      setGender("");
      setAppointmentDate("");
      setDepartment("");
      setDoctorFirstName("");
      setDoctorLastName("");
      setHasVisited(false);
      setAddress("");
    } catch (error) {
      toast.error(
        "Error submitting appointment: " + error.response.data
      );
    }
  };

  return (
    <>
      <div className="container form-component appointment-form">
        <h2>Appointment</h2>
        <form onSubmit={handleAppointment}>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="date"
              placeholder="Appointment Date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>
          <div>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setDoctorFirstName("");
                setDoctorLastName("");
              }}
            >
              {departmentsArray.map((depart, index) => {
                return (
                  <option value={depart} key={index}>
                    {depart}
                  </option>
                );
              })}
            </select>
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
              disabled={!department || doctors.length === 0}
            >
              <option value="">Select Doctor</option>
              {doctors
                .filter((doctor) => doctor.doctorDepartment === department)
                .map((doctor) => (
                  <option
                    key={doctor.id}
                    value={`${doctor.firstName} ${doctor.lastName}`}
                  >
                    {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
            </select>
          </div>
          <textarea
            rows="10"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <p style={{ marginBottom: 0 }}>Have you visited before?</p>
            <input
              type="checkbox"
              checked={hasVisited}
              onChange={(e) => setHasVisited(e.target.checked)}
              style={{ flex: "none", width: "25px" }}
            />
          </div>
          <button style={{ margin: "0 auto" }}>GET APPOINTMENT</button>
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;