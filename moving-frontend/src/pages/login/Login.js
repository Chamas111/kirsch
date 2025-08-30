import "./login.css";
import logo from "../../components/navbar/fotos/logo.svg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../axiosinstance";

function Login({ setIsLoggedin }) {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    axios
      .post("/auth/login", user, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setIsLoggedin(true);
        navigate("/");
      })
      .catch((err) => {
        console.log("🔥 FULL ERROR:", err.response?.data);
        const error = err.response?.data;
        if (error?.field) {
          // field-specific error
          setErrors((prev) => ({ ...prev, [error.field]: error.message }));
        } else if (error?.message) {
          // general error
          // You can try to map "Invalid Password Attempt" to password field
          if (error.message.toLowerCase().includes("password")) {
            setErrors((prev) => ({ ...prev, password: error.message }));
          } else if (error.message.toLowerCase().includes("email")) {
            setErrors((prev) => ({ ...prev, email: error.message }));
          } else {
            setErrors({ general: error.message });
          }
        } else {
          setErrors({ general: "Login failed ❌" });
        }
      });
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="text-center text-info mb-4">Login</h2>
        <img
          src={logo}
          style={{ width: "150px", height: "150px" }}
          className="rounded mx-auto d-block rounded-circle"
        />
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email" className="text-info">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="username"
              className="form-control"
              value={user.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password" className="text-info">
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              value={user.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          {errors.general && (
            <p className="error text-center">{errors.general}</p>
          )}
          <button type="submit" className="btn btn-info w-100">
            Submit
          </button>

          <div className="text-center mt-3">
            <Link
              to="/register"
              className="text-info text-black fs-6 text-decoration-underline icon-link icon-link-hover "
            >
              Register here!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
