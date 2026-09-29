import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const handleLogout = async () => {
    try {
      await axios.post(
       "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/products" className="navbar-logo">
        Mini<span>Shop</span>
      </Link>

      <div className="navbar-links">
        <Link to="/products">Products</Link>

        {!token ? (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;