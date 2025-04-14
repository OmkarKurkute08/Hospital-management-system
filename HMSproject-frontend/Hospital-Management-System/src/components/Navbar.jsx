import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import Cookies from "universal-cookie";
// import "./Navbar.css";

const Navbar = () => {
    const cookie = new Cookies();
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const handleLogout = async () => {
    const token = cookie.get("token");
  
    // Ensure token is present before calling the API
    if (!token) {
      toast.error("You are not logged in.");
      return;
    }
  
    try {
      // Send a request to the backend to log the user out
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/patient/logout?email=john.doe1@example.com",
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Show success message from response
      toast.success("Logout successful. You have been logged out.");
  
      // Clear token from cookies after successful logout
      cookie.remove("token");
      cookie.remove("email");
  
      // Update the authentication status in context
      setIsAuthenticated(false);
  
      // Optionally, redirect the user to the login page
      navigateTo("/login");
    } catch (error) {
      // Handle any errors and show a toast with the error message
      toast.error(error.response?.data?.message || "An error occurred during logout.");
    }
  };
  

  const navigateTo = useNavigate();

  const goToLogin = () => {
    navigateTo("/login");
  };

  return (
    <>
      <nav className={"container"}>
        <div className="logo">
          <img src="/logo.png" alt="logo" className="logo-img" />
        </div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link to={"/"} onClick={() => setShow(!show)}>
              Home
            </Link>
            <Link to={"/appointment"} onClick={() => setShow(!show)}>
              Appointment
            </Link>
            {/* <Link to={"/rescheduleAppointment"} onClick={() => setShow(!show)}>
            RescheduleAppointment
            </Link> */}
            <Link to={"/about"} onClick={() => setShow(!show)}>
              About Us
            </Link>
            <Link to={"/profile"} onClick={() => setShow(!show)}>
              Profile
            </Link>
          </div>
          {isAuthenticated ? (
            <button className="logoutBtn btn" onClick={handleLogout}>
              LOGOUT
            </button>
          ) : (
            <button className="loginBtn btn" onClick={goToLogin}>
              LOGIN
            </button>
          )}
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;