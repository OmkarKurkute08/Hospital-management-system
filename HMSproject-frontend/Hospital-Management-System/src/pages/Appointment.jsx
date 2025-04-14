import React from "react";
import Hero from "../components/Hero";
import AppointmentForm from "../components/AppointmentForm";
import { Link } from "react-router-dom";

const Appointment = () => {
  return (
    <>
      <Hero
        title={"Book Your Appointment"}
        imageUrl={"/signin.png"}
      />
      
      <AppointmentForm/>

    </>
  );
};

export default Appointment;