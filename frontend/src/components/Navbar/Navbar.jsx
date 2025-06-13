import React, { useContext } from 'react'
import "./Navbar.css"
import { AiOutlineHome } from "react-icons/ai";
import { FiBox, FiPhone, FiShoppingCart, FiUser} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from 'react'
import { context } from '../Context/Context';
import { toast } from 'react-toastify';

const Navbar = () => {

  const { user, setUser, getLoggedInUser } = useContext(context);
  const location = useLocation();
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Logout Successful!");
        setUser(null);
        await getLoggedInUser();
        navigate("/login");
      }
      else {
        toast.error("An error occured while Logout")
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className='navbar'>
      <div className="logo">
        <Link to="/"><img src="/src/assets/images/VB_LOGO.png" loading='lazy' alt='Logo' /></Link>
      </div>
      <ul className="navlinks">
        <li className="navlink">
          <Link to="/" className={location.pathname === "/" ? "active" : ""} >
            <AiOutlineHome size={20} /> Home
          </Link>
        </li>
        <li className="navlink">
          <Link to="/products" className={location.pathname === "/products" ? "active" : ""} >
            <FiBox size={20} /> All Porducts
          </Link>
        </li>
        <li className="navlink">
          <Link to="/cart" className={location.pathname === "/cart" ? "active" : ""} >
            <FiShoppingCart size={20} /> Cart
          </Link>
        </li>
        {
          user ? (
            user.role === "user" ? (
              <li>
                <Link className='become-seller-btn' to="/becomeSeller">Become a Seller</Link>
              </li>
            ) : null
          ) : null
        }

        {
          user ? (
            user.role === "admin" ? (
              <li>
                <Link className='admin-btn' to="/admin/dashboard">Admin Panel</Link>
              </li>
            ) : null
          ) : null
        }

        {
          user ? (
            <select
              value={
                location.pathname.includes("/profile") ? "/profile" :
                  location.pathname.includes("/dashboard") ? "/dashboard" :
                    "default"
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === "logout") handleLogout();
                else navigate(value);
              }}
            >
              <option value="default" disabled>
                Hi👋, {user.username}
              </option>
              <option value="/profile">My Profile</option>
              {user.role === "seller" && <option value="/dashboard">Dashboard</option>}
              <option value="logout">Logout</option>
            </select>
          ) : (
            <li className='login-cont'>
              <Link to="/login" className={`login-btn`}>
                <FiUser size={20} /> Login
              </Link>
            </li>
          )
        }
      </ul>
    </div>
  )
}

export default Navbar