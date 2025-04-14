import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
// import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const Sidebar = () => {
  const cookie = new Cookies();
  const [show, setShow] = useState(false);

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const handleLogout = async () => {
    const token = cookie.get("doctor-token");

    // Ensure token is present before calling the API
    if (!token) {
      toast.error("You are not logged in.");
      return;
    }

    try {
      // Send a request to the backend to log the user out
      const response = await axios.get(
        `http://localhost:8080/api/v1/user/doctor/logout?email=${cookie.get("doctor-email")}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Show success message from response
      toast.success(response.data.message);

      // Clear token from cookies after successful logout
      cookie.remove("doctor-token");
      cookie.remove("doctor-email");

      // Update the authentication status in context
      setIsAuthenticated(false);

      // Optionally, redirect the user to the login page
      navigateTo("/login");
      toast.success("Logout successful. You have been logged out.");
    } catch (error) {
      // Handle any errors and show a toast with the error message
      toast.error(error.response?.data?.message || "An error occurred during logout.");
    }
  };

  const navigateTo = useNavigate();

  const gotoHomePage = () => {
    navigateTo("/");
    setShow(!show);
    toast.info("Navigated to Home Page.");
  };

  const gotoDoctorsPage = () => {
    navigateTo("/doctors");
    setShow(!show);
    toast.info("Navigated to Doctors Page.");
  };

  const gotoMessagesPage = () => {
    navigateTo("/messages");
    setShow(!show);
    toast.info("Navigated to Messages Page.");
  };

  const gotoAddNewDoctor = () => {
    navigateTo("/doctor/addnew");
    setShow(!show);
    toast.info("Navigated to Add New Doctor Page.");
  };

  // const gotoAddNewdoctor = () => {
  //   navigateTo("/doctor/addnew");
  //   setShow(!show);
  //   toast.info("Navigated to Add New doctor Page.");
  // };

  return (
    <>
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={show ? "show sidebar" : "sidebar"}
      >
        <div className="links">
          <TiHome onClick={gotoHomePage} />
          <FaUserDoctor onClick={gotoDoctorsPage} />
          {/* <MdAddModerator onClick={gotoAddNewdoctor} /> */}
          <IoPersonAddSharp onClick={gotoAddNewDoctor} />
          <AiFillMessage onClick={gotoMessagesPage} />
          <RiLogoutBoxFill onClick={handleLogout} />
        </div>
      </nav>
      <div
        className="wrapper"
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
      >
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;