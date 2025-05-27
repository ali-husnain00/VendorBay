import React, { useContext } from 'react'
import "./Navbar.css"
import { AiOutlineHome } from "react-icons/ai";
import { FiInfo, FiPhone, FiShoppingCart, FiUser } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from 'react'
import { context } from '../Context/Context';

const Navbar = () => {

  const {user, setUser,  getLoggedInUser} = useContext(context);
  const location = useLocation();
  const navigate = useNavigate()

  const handleLogout = async () => {
  try {
    const res = await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      alert("Logout Successful!");
      setUser(null);
      await getLoggedInUser();
      navigate("/login");
    }
  } catch (error) {
    console.log(error);
  }
};


  return (
    <div className='navbar'>
      <div className="logo">
        <Link to="/"><img src="/src/assets/images/VB_LOGO.png" alt='Logo' /></Link>
      </div>
      <ul className="navlinks">
        <li className = "navlink">
          <Link to="/" className={location.pathname === "/" ? "active" : ""} >
            <AiOutlineHome size={20} /> Home
          </Link>
        </li>
        <li className = "navlink">
          <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>
            <FiPhone size={20} /> Contact
          </Link>
        </li>
        <li className = "navlink">
          <Link to="/cart" className={location.pathname === "/cart" ? "active" : ""} >
            <FiShoppingCart size={20} /> Cart
          </Link>
        </li>
        {
          user ?
          <select>
            <option selected disabled>Hi👋, {user.username}</option>
            <option onClick={() =>navigate("/profile")}>My Profile</option>
            <option className={user.role === "seller" ? "show" : "hide"} onClick={() =>navigate("/dashboard")}>Dashboard</option>
            <option onClick={handleLogout}>Logout</option>
          </select>
          :
          <li className='login-cont'>
          <Link to="/login" className={`login-btn `} >
            <FiUser size={20} /> Login
          </Link>
        </li>
        }
      </ul>
    </div>
  )
}

export default Navbar