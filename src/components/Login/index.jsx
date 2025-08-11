import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../api";

import "./index.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, showSubmitError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false); // NEW STATE

  const navigate = useNavigate();

  const onSubmitSuccess = () => {
    navigate("/todos");
  };

  const onSubmitFailure = () => {
    showSubmitError(true);
  };

  const onChangingEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChangingPassword = (event) => {
    setPassword(event.target.value);
  };

  const onChangeEmailBlur = () => {
    if (email.trim() === "") {
      setEmailError("*Required");
    } else {
      setEmailError("");
    }
  };

  const onChangePasswordBlur = () => {
    if (password.trim() === "") {
      setPasswordError("*Required");
    } else {
      setPasswordError("");
    }
  };

  const renderEmailField = () => (
    <>
      <label htmlFor="email" className="input-label">
        EMAIL
      </label>
      <input
        id="email"
        className="input-field"
        type="email"
        value={email}
        onChange={onChangingEmail}
        onBlur={onChangeEmailBlur}
      />
      {emailError && (
        <p className="error-text" style={{ color: "red", marginTop: "5px" }}>
          {emailError}
        </p>
      )}
    </>
  );

  const renderPasswordField = () => (
    <>
      <label htmlFor="password" className="input-label">
        PASSWORD
      </label>
      <div className="password-input-container">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          onChange={onChangingPassword}
          className="input-field"
          onBlur={onChangePasswordBlur}
        />
        <span
          className="toggle-password-icon"
          onClick={() => setShowPassword((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      {passwordError && (
        <p className="error-text" style={{ color: "red", marginTop: "5px" }}>
          {passwordError}
        </p>
      )}
    </>
  );

  const onSubmitForm = async (event) => {
    event.preventDefault();

    setLoading(true);

    const userDetails = { email, password };

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, userDetails, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(res.data);
      onSubmitSuccess();
      localStorage.setItem("my_todo_project_token", res.data.token); // Save token
    } catch (error) {
      console.error("Login error:", error);
      onSubmitFailure();
    } finally {
      setLoading(false); // HIDE LOADER
    }
  };

  return (
    <div className="background-container">
      <form className="card-container" onSubmit={onSubmitForm}>
        <h1 className="heading">Login</h1>
        <div className="input-container">{renderEmailField()}</div>
        <br />
        <div className="input-container">{renderPasswordField()}</div>
        <br />

        <button type="submit" className="signup-btn">
          Login
        </button>
        {submitError && <p style={{ color: "red" }}>*Bad Request</p>}
        <p>Don't have an account?</p>
        <Link to="/" style={{ textDecoration: "none" }}>
          <button type="button" className="login-btn">
            SignUp
          </button>
        </Link>
        {loading && (
          <div className="loader-overlay">
            <div className="loader"></div>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
