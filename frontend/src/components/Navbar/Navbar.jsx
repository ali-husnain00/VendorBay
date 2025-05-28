import React, { useContext } from 'react'
import "./Navbar.css"
import { AiOutlineHome } from "react-icons/ai";
import { FiInfo, FiPhone, FiShoppingCart, FiUser} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from 'react'
import { context } from '../Context/Context';
import { toast } from 'react-toastify';

const Navbar = () => {

  const { user, setUser, getLoggedInUser } = useContext(context);
  const location = useLocation();
  const navigate = useNavigate()

  const unseenCount = user?.notifications?.filter(n => !n.seen).length || 0;

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
        <Link to="/"><img src="/src/assets/images/VB_LOGO.png" alt='Logo' /></Link>
      </div>
      <ul className="navlinks">
        <li className="navlink">
          <Link to="/" className={location.pathname === "/" ? "active" : ""} >
            <AiOutlineHome size={20} /> Home
          </Link>
        </li>
        <li className="navlink">
          <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>
            <FiPhone size={20} /> Contact
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
        {
          user && (
            <li className="navlink notif-icon">
              <Link to="/notifications">
                <IoMdNotificationsOutline size={24} />
                {unseenCount > 0 && <span className="notif-badge">{unseenCount}</span>}
              </Link>
            </li>
          )
        }
      </ul>
    </div>
  )
}

export default Navbar