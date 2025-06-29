import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-column">
          <Link to="/"><h2>Vendor<span>Bay</span></h2></Link>
          <p>Your one-stop shop for everything amazing. Discover the latest trends, and sell smarter with us.</p>
        </div>

        <div className="footer-column">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link>Categories</Link></li>
            <li><Link>Latest</Link></li>
            <li><Link>Offers</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li><Link>About Us</Link></li>
            <li><Link to="/becomeSeller">Become a Seller</Link></li>
            <li><Link>Careers</Link></li>
            <li><Link>Contact</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li><Link>Help Center</Link></li>
            <li><Link>Returns</Link></li>
            <li><Link>Privacy Policy</Link></li>
            <li><Link>Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} VendorBay. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
