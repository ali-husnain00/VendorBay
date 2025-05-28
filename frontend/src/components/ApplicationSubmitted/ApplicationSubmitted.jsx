import React from 'react';
import './ApplicationSubmitted.css';
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router';

const ApplicationSubmitted = () => {

  const navigate = useNavigate()

  return (
    <div className="application-submitted">
      <div className="confirmation-box">
        <FaCheckCircle className="check-icon" />
        <h2>Application Submitted!</h2>
        <p>
          Thank you for applying to become a seller on <strong>VendorBay</strong>.
          <br />
          Our team is reviewing your information. We’ll notify you once your application is approved or if we need more details.
        </p>
        <p className="highlight">Stay tuned for updates in your notifications!</p>
        <div className="back-to-home-btn">
          <button onClick={() =>navigate("/")}>Back to home</button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSubmitted;
