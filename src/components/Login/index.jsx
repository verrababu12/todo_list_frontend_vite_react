// frontend/src/components/Login/index.jsx
import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      console.log(res);
      localStorage.setItem("project_todo_token", res.data.token);
      navigate("/todos"); // Redirect to TodoList page
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Login</h2>
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
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
