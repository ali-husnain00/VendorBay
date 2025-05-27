import React, { useState } from 'react';
import './Register.css';
import { Link } from 'react-router';

const Register = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) =>{
    e.preventDefault();

    try {

      const res = await fetch("http://localhost:3000/register",{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body:JSON.stringify({name, email, password})
      })

      if(res.ok){
        setName("");
        setEmail("");
        setPassword("");
        alert("User Registered Successfully!");
      }

      else{
        alert("An error occured while registering user")
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="register">
      <div className="register-container">
      <h2>Create Your VendorBay Account</h2>
      <form>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) =>setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) =>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) =>setPassword(e.target.value)}  required />
        <button type="submit" onClick={handleRegister}>Register</button>
        <p>Already have an account? <Link to="/Login">Login</Link></p>
      </form>
    </div>
    </div>
  );
};

export default Register;
