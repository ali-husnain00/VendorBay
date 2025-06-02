import React from 'react';
import './BecomeSellerBanner.css';
import { useNavigate } from 'react-router-dom';

const BecomeSellerBanner = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/becomeSeller');
  };

  return (
    <section className="seller-banner">
      <div className="banner-content">
        <h2>Start Selling on VendorBay 🚀</h2>
        <p>Join thousands of sellers and grow your business today!</p>
        <button onClick={handleClick}>Become a Seller</button>
      </div>
      <div className="banner-image">
        <img src="/src/assets/images/SellerBannerImage.png" loading="lazy"  />
      </div>
    </section>
  );
};

export default BecomeSellerBanner;
