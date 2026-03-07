import React, { useContext, useState, useRef, useEffect } from 'react'
import "./Navbar.css"
import { Home, X, Menu, Package, ShoppingCart, User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { context } from '../Context/Context';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, setUser, getLoggedInUser, BASE_URL } = useContext(context);
  const [activeMenu, setActiveMenu] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setActiveMenu(false);
    try {
      const res = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Logout Successful!");
        setUser(null);
        await getLoggedInUser();
        navigate("/login");
      } else {
        toast.error("An error occurred while logging out");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setActiveMenu(false);
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const closeMenu = () => {
    setActiveMenu(false);
    setUserDropdownOpen(false);
  };

  return (
    <div className='navbar'>
      <div className="logo">
        <Link to="/"><img src="/images/VB_LOGO.png" loading="lazy" alt="VendorBay logo" /></Link>
      </div>
      <ul className={`navlinks ${activeMenu ? "show-menu" : ""}`} role="navigation" aria-label="Main">
        <li className="close-menu">
          <button
            type="button"
            className="close-menu-btn"
            onClick={() => setActiveMenu(false)}
            aria-label="Close menu"
            aria-expanded={activeMenu}
          >
            <X size={24} color="white" aria-hidden />
          </button>
        </li>
        <li className="navlink">
          <Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={closeMenu}>
            <Home size={20} aria-hidden /> Home
          </Link>
        </li>
        <li className="navlink">
          <Link to="/products" className={location.pathname === "/products" ? "active" : ""} onClick={closeMenu}>
            <Package size={20} aria-hidden /> All Products
          </Link>
        </li>
        <li className="navlink">
          <Link to="/cart" className={location.pathname === "/cart" ? "active" : ""} onClick={closeMenu}>
            <ShoppingCart size={20} aria-hidden /> Cart
          </Link>
        </li>
        {user?.role === "user" && (
          <li>
            <Link className="become-seller-btn" to="/becomeSeller" onClick={closeMenu}>Become a Seller</Link>
          </li>
        )}
        {user?.role === "admin" && (
          <li>
            <Link className="admin-btn" to="/admin/dashboard" onClick={closeMenu}>Admin Panel</Link>
          </li>
        )}
        {user ? (
          <li className="user-dropdown-wrap" ref={dropdownRef}>
            <button
              type="button"
              className={`user-dropdown-trigger ${userDropdownOpen ? "user-dropdown-open" : ""}`}
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              aria-expanded={userDropdownOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              Hi, {user.username}
              <ChevronDown size={18} aria-hidden className="user-dropdown-chevron" />
            </button>
            {userDropdownOpen && (
              <div className="user-dropdown-panel" role="menu">
                <Link to="/profile" role="menuitem" onClick={closeMenu}>
                  <User size={18} aria-hidden /> My Profile
                </Link>
                {user.role === "seller" && (
                  <Link to="/dashboard" role="menuitem" onClick={closeMenu}>
                    <LayoutDashboard size={18} aria-hidden /> Dashboard
                  </Link>
                )}
                <button type="button" role="menuitem" data-action="logout" onClick={handleLogout}>
                  <LogOut size={18} aria-hidden /> Logout
                </button>
              </div>
            )}
          </li>
        ) : (
          <li className="login-cont">
            <Link to="/login" className="login-btn" onClick={closeMenu}>
              <User size={20} aria-hidden /> Login
            </Link>
          </li>
        )}
      </ul>
      <button
        type="button"
        className="menu"
        onClick={() => setActiveMenu(!activeMenu)}
        aria-label={activeMenu ? "Close menu" : "Open menu"}
        aria-expanded={activeMenu}
      >
        <Menu size={28} aria-hidden />
      </button>
    </div>
  );
};

export default Navbar;
