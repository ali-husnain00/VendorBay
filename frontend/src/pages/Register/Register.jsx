import React, { useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading/Loading';

const Register = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const handleRegister = async (e) =>{
    setLoading(true)
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
        toast.success("User Registered Successfully!");
        navigate("/login ")
      }

      else{
        toast.error("An error occured while registering user")
      }
      
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  }

  if(loading){
    return <Loading/>
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
