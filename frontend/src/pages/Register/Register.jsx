import React, { useState, useContext } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { context } from '../../components/Context/Context';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { BASE_URL } = useContext(context);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        setName("");
        setEmail("");
        setPassword("");
        toast.success("User registered successfully!");
        navigate("/login");
      } else {
        toast.error("An error occurred while registering");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register" aria-label="Create account">
      <div className="register-container">
        <h1 className="register-title">Create Your VendorBay Account</h1>
        <form onSubmit={handleRegister} noValidate>
          <div className="form-group">
            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Register"}
          </button>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </main>
  );
};

export default Register;
