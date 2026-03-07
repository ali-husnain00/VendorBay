import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  const shopLinks = [
    { to: '/products', label: 'All Products' },
    { to: '#', label: 'Categories', title: 'Coming soon' },
    { to: '#', label: 'Latest', title: 'Coming soon' },
    { to: '#', label: 'Offers', title: 'Coming soon' },
  ];
  const companyLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/becomeSeller', label: 'Become a Seller' },
    { to: '#', label: 'Careers', title: 'Coming soon' },
    { to: '/contact', label: 'Contact' },
  ];
  const supportLinks = [
    { to: '#', label: 'Help Center', title: 'Coming soon' },
    { to: '#', label: 'Returns', title: 'Coming soon' },
    { to: '#', label: 'Privacy Policy', title: 'Coming soon' },
    { to: '#', label: 'Terms & Conditions', title: 'Coming soon' },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand-col">
          <Link to="/" className="footer-brand">Vendor<span>Bay</span></Link>
          <p className="footer-about">
            Your one-stop marketplace to discover, buy, and sell with confidence. We connect buyers with trusted sellers for a simple and secure experience.
          </p>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">Shop</h4>
          <ul className="footer-links-list">
            {shopLinks.map(({ to, label, title }) => (
              <li key={label}>
                <Link to={to} title={title}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">Company</h4>
          <ul className="footer-links-list">
            {companyLinks.map(({ to, label, title }) => (
              <li key={label}>
                <Link to={to} title={title}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">Support</h4>
          <ul className="footer-links-list">
            {supportLinks.map(({ to, label, title }) => (
              <li key={label}>
                <Link to={to} title={title}>{label}</Link>
              </li>
            ))}
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
