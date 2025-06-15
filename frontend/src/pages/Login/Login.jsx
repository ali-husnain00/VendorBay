import React, { useContext, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { context } from '../../components/Context/Context';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading/Loading';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {getLoggedInUser, user, getSellerInfo, getSellerStats, BASE_URL} = useContext(context);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) =>{
      setLoading(true)
      e.preventDefault();

    try {

      const res = await fetch(`${BASE_URL}/login`,{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        credentials:"include",
        body:JSON.stringify({email, password})
      })

      if(res.ok){
        setEmail("");
        setPassword("");
        toast.success("User LoggedIn Successfully!");
        getLoggedInUser();
        getSellerInfo();
        getSellerStats();
        navigate("/")
      }

      else{
        toast.error("An error occured while Login")
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
    <div className="login">
      <div className="login-container">
      <h2>Welcome Back to VendorBay</h2>
      <form>
        <input type="email" value={email} onChange={(e) =>setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) =>setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit" onClick={handleLogin}>Login</button>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
    </div>
  );
};

export default Login;
