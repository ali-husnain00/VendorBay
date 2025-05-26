import React from 'react'
import "./Navbar.css"
import {Link} from "react-router-dom"
import { useState } from 'react'

const Navbar = () => {

  const [activeLink, setActiveLink] = useState("home");

  return (
    <div className='navbar'>
      <div className="logo">
        <Link to="/"><img src="/src/assets/images/VB_LOGO.png" alt='Logo'/></Link>
      </div>
      <ul className="navlinks">
        <Link to="/" className={activeLink === "home" ? "active" : ""} onClick={() =>setActiveLink("home")}>Home</Link>
        <Link to="/about" className={activeLink === "about" ? "active" : ""} onClick={() =>setActiveLink("about")}>About</Link>
        <Link to="/contact" className={activeLink === "contact" ? "active" : ""} onClick={() =>setActiveLink("contact")}>Contact</Link>
        <Link to="/cart" className={activeLink === "cart" ? "active" : ""} onClick={() =>setActiveLink("cart")}>Cart</Link>
        <Link to="/login" className='login-btn'  onClick={() =>setActiveLink("login")}><li>Login</li></Link>
      </ul>
    </div>
  )
}

export default Navbar