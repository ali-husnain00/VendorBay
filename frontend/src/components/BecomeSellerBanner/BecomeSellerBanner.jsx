import React from 'react';
import './BecomeSellerBanner.css';
import { useNavigate } from 'react-router-dom';
import { context } from '../Context/Context';
import { useContext } from 'react';

const BecomeSellerBanner = () => {
  const navigate = useNavigate();
  const {user} = useContext(context)

  const handleClick = () => {
    navigate('/becomeSeller');
  };

  return (
    <section className={`seller-banner ${user?.role === "seller" || user?.role === "admin" ? "flex" : ""}`}>
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
