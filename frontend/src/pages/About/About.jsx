import React from 'react';
import './About.css';

const About = () => {
  return (
    <main className="about-page" aria-label="About us">
      <h1 className="about-heading">About VendorBay</h1>
      <p className="about-tagline">Your one-stop marketplace to discover, buy, and sell with confidence.</p>
      <div className="about-content">
        <p>
          VendorBay connects buyers with trusted sellers, offering a wide range of products from everyday essentials to unique finds. We aim to make shopping and selling simple, secure, and enjoyable.
        </p>
        <p>
          Whether you're looking to shop the latest trends or grow your business as a seller, VendorBay is here to support you. Our platform is built with reliability and user experience in mind.
        </p>
      </div>
    </main>
  );
};

export default About;
