import React from "react";
import Hero from "../components/Hero";
import RescheduleAppointmentForm from "../components/RescheduleAppointmentForm";

const RescheduleAppointment = () => {
  return (
    <>
      <Hero
        title={"Reschedule Your Appointment"}
        imageUrl={"/signin.png"}
      />
      <RescheduleAppointmentForm />
    </>
  );
};

export default RescheduleAppointment;