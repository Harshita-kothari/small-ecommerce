import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";


const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
        "https://small-ecommerce-sffc.onrender.com/api/auth/register",
        formData
      );

      alert(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account 🚀</h1>

        <p className="auth-subtitle">
          Create your MiniShop account
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;