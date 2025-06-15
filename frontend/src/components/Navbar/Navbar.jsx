import React, { useContext } from 'react'
import "./Navbar.css"
import { AiOutlineHome } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { HiMenuAlt1 } from "react-icons/hi";
import { FiBox, FiPhone, FiShoppingCart, FiUser} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from 'react'
import { context } from '../Context/Context';
import { toast } from 'react-toastify';

const Navbar = () => {

  const { user, setUser, getLoggedInUser } = useContext(context);
  const [activeMenu, setActiveMenu] = useState(false);
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
      <ul className={`navlinks ${activeMenu ? "show-menu" : ""}`}>
        <li className="close-menu">
          <RxCross2 color='white' fontSize={30} fontWeight={1000} cursor="pointer"  onClick={() =>setActiveMenu(!activeMenu)}/>
        </li>
        <li className="navlink">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}  onClick={() =>setActiveMenu(false)} >
            <AiOutlineHome size={20} /> Home
          </Link>
        </li>
        <li className="navlink">
          <Link to="/products" className={location.pathname === "/products" ? "active" : ""}  onClick={() =>setActiveMenu(false)} >
            <FiBox size={20} /> All Porducts
          </Link>
        </li>
        <li className="navlink">
          <Link to="/cart" className={location.pathname === "/cart" ? "active" : ""}  onClick={() =>setActiveMenu(false)} >
            <FiShoppingCart size={20} /> Cart
          </Link>
        </li>
        {
          user ? (
            user.role === "user" ? (
              <li>
                <Link className='become-seller-btn' to="/becomeSeller" onClick={() =>setActiveMenu(false)}>Become a Seller</Link>
              </li>
            ) : null
          ) : null
        }

        {
          user ? (
            user.role === "admin" ? (
              <li>
                <Link className='admin-btn' to="/admin/dashboard" onClick={() =>setActiveMenu(false)}>Admin Panel</Link>
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
                setActiveMenu(false);
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
              <Link to="/login" className={`login-btn`} onClick={() =>setActiveMenu(false)}>
                <FiUser size={20} /> Login
              </Link>
            </li>
          )
        }
      </ul>
      <div className="menu">
        <HiMenuAlt1 fontSize={35} cursor="pointer" onClick={() =>setActiveMenu(!activeMenu)}/>
      </div>
    </div>
  )
}

export default Navbar