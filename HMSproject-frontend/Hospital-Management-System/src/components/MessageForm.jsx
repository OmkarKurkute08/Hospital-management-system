import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";

const MessageForm = () => {
    const cookie = new Cookies();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleMessage = async (e) => {
    e.preventDefault();
  
    // Validate phone number length
    if (phone.length < 10 || phone.length > 15) {
      toast.error("Phone number must be between 10 and 15 characters.");
      return; // Stop form submission if phone number is invalid
    }
  
    try {
      const token = cookie.get('token');
      await axios
        .post(
          "http://localhost:8080/api/v1/message/send",
          { firstName, lastName, email, phone, message },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          // Success toast
          toast.success("Your message has been sent successfully!");
          
          // Optionally show the message from the backend if you want
          // toast.success(res.data.message);
  
          // Clear form fields
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setMessage("");
        });
    } catch (error) {
      // Error toast with backend message
      toast.error(error.response.data || "There was an issue sending the message.");
    }
  };
  
  

  return (
    <>
      <div className="container form-component message-form">
        <h2>Send Us A Message</h2>
        <form onSubmit={handleMessage}>
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
          <textarea
            rows={7}
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Send</button>
          </div>
        </form>
        <img src="/Vector.png" alt="vector" />
      </div>
    </>
  );
};

export default MessageForm;