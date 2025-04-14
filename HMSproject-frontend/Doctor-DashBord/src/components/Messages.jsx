import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";

const Messages = () => {
    const cookie = new Cookies();
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
      const token = cookie.get("doctor-token");
        const { data } = await axios.get(
          "http://localhost:8080/api/v1/user/doctor/message/all",
          { withCredentials: true , headers: { Authorization: `Bearer ${token}` }}
        );
        
        setMessages(data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchMessages();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page messages">
      <h1>MESSAGE</h1>
      <div className="banner">
      {messages && messages.length > 0 ? (
  messages.map((element) => {
    return (
      <div className="card" key={element.id || element.email}> {/* Fall back to email if _id is missing */}
        <div className="details">
          <p>
            First Name: <span>{element.firstName}</span>
          </p>
          <p>
            Last Name: <span>{element.lastName}</span>
          </p>
          <p>
            Email: <span>{element.email}</span>
          </p>
          <p>
            Phone: <span>{element.phone}</span>
          </p>
          <p>
            Message: <span>{element.message}</span>
          </p>
        </div>
      </div>
    );
  })
) : (
  <h1>No Messages!</h1>
)}

      </div>
    </section>
  );
};

export default Messages;