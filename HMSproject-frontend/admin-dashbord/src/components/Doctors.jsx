import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";

const Doctors = () => {
  const cookie = new Cookies();
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);
  const [totalDoctors, setTotalDoctors] = useState(0);
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = cookie.get("admin-token");
        const { data } = await axios.get(
          "http://localhost:8080/api/v1/user/doctors",
          { withCredentials: true , headers: { Authorization: `Bearer ${token}` }}
        );
        console.log("API Response:", data); // 🔍 Debugging
        
        setDoctors(data);
        setTotalDoctors(data.length);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchDoctors();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  return (
    <section className="page doctors">
      <h1>DOCTORS</h1>
      <div className="banner">
      {doctors && doctors.length > 0 ? (
  doctors.map((element) => {
    return (
      <div className="card" key={element.id}> {/* Add key here */}
        <img
          src={element.docAvatar || "/default-avatar.png"}
          alt="doctor avatar"
        />
        <h4>{`${element.firstName} ${element.lastName}`}</h4>
        <div className="details">
          <p>Email: <span>{element.email}</span></p>
          <p>Phone: <span>{element.phone}</span></p>
          <p>DOB: <span>{element.dob.substring(0, 10)}</span></p>
          <p>Department: <span>{element.doctorDepartment}</span></p>
          <p>Experience: <span>{element.experience}</span></p>
          <p>Gender: <span>{element.gender}</span></p>
        </div>
      </div>
    );
  })
) : (
  <h1>No Registered Doctors Found!</h1>
)}
      </div>
    </section>
  );
};

export default Doctors;