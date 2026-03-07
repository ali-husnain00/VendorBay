import React from 'react';
import './ApplicationSubmitted.css';
import { CheckCircle } from "lucide-react";
import { useNavigate } from 'react-router';

const ApplicationSubmitted = () => {

  const navigate = useNavigate()

  return (
    <div className="application-submitted">
      <div className="confirmation-box">
        <CheckCircle className="check-icon" size={48} />
        <h2>Application Submitted!</h2>
        <p>
          Thank you for applying to become a seller on <strong>VendorBay</strong>.
          <br />
          Our team is reviewing your information. We’ll notify you once your application is approved or if we need more details.
        </p>
        <p className="highlight">Stay tuned for updates in your notifications!</p>
        <div className="back-btn">
          <button onClick={() =>navigate("/")}>Back to home</button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSubmitted;
