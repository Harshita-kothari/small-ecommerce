import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://small-ecommerce-sffc.onrender.com/api/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );

      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );

      alert("Login successful");

      navigate("/products");
    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back 👋</h1>

        <p className="auth-subtitle">
          Login to manage your products
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;