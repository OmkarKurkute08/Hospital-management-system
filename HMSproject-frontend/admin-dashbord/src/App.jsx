import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewDoctor from "./components/AddNewDoctor";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import AddNewAdmin from "./components/AddNewAdmin";
import "./App.css";
import Cookies from "universal-cookie";

const App = () => {
    const cookie = new Cookies();
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
    useContext(Context);
    const token = cookie.get("admin-token");
  const email = cookie.get("admin-email");

  useEffect(() => {
    // Check if both token and email exist in cookies after reload
    if (token && email) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/v1/user/admin/me?email=${email}`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsAuthenticated(true);
          // console.log(response.data.firstName);
          
          setAdmin(response.data.firstName);
        } catch (error) {
          console.error("Error fetching user:", error);
          setIsAuthenticated(false);
          setAdmin({});
        }
      };

      fetchUser();
    } else {
      // If no token or email in cookies, reset authentication state
      setIsAuthenticated(false);
      setAdmin({});
    }
  }, [isAuthenticated, email, token, setIsAuthenticated, setAdmin]);
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor/addnew" element={<AddNewDoctor />} />
        <Route path="/admin/addnew" element={<AddNewAdmin />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/doctors" element={<Doctors />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;