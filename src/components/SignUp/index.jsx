// frontend/src/components/Signup/index.jsx
import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/signup`, formData);
      alert("Signup successful! Please login.");
      navigate("/login"); // redirect to login page
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Signup</h2>
      <input
        name="username"
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Signup</button>
      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{
            cursor: "pointer",
            color: "blue",
            background: "none",
            border: "none",
            textDecoration: "underline",
          }}
        >
          Login
        </button>
      </p>
    </form>
  );
}

export default Signup;
