import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
import Cookies from "universal-cookie";

const Login = () => {
  const cookie = new Cookies();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Input validation
    if (!email) {
      toast.error("Email is required!");
      return;
    }
    if (!password) {
      toast.error("Password is required!");
      return;
    }
    // if (password !== confirmPassword) {
    //   toast.error("Passwords do not match!");
    //   return;
    // }
    try {
      await axios
        .post(
          "http://localhost:8080/api/v1/user/doctor/login",
          { email, password, role: "DOCTOR" },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          cookie.set("doctor-token", res.data);
          cookie.set("doctor-email", email);
          toast.success("Login successful!");
          setIsAuthenticated(true);
          navigateTo("/");
          setEmail("");
          setPassword("");
          // setConfirmPassword("");
        });
    } catch (error) {
      // console.error(error.response.data);
      toast.error(error.response.data);
      // toast.error("Login failed. Please try again.");
    }
  };
  
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <section className="container form-component">
        <img src="/logo.png" alt="logo" className="logo" />
        <h1 className="form-title">WELCOME TO APOLLO HOPITAL</h1>
        <p>THIS PAGE IS ONLY FOR DOCTORS</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          /> */}
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Login</button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;