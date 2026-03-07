import React, { useContext, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { context } from '../../components/Context/Context';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { getLoggedInUser, getSellerInfo, getSellerStats, BASE_URL } = useContext(context);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setEmail("");
        setPassword("");
        toast.success("User logged in successfully!");
        getLoggedInUser();
        getSellerInfo();
        getSellerStats();
        navigate("/");
      } else {
        toast.error("An error occurred while logging in");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login" aria-label="Login">
      <div className="login-container">
        <h1 className="login-title">Welcome Back to VendorBay</h1>
        <form onSubmit={handleLogin} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </form>
      </div>
    </main>
  );
};

export default Login;
