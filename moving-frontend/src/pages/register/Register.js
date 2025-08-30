import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import logo from "../../components/navbar/fotos/logo.svg";
import axios from "../../axiosinstance";
function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/auth/register", user)
      .then((res) => {
        console.log("dddd", res.data);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return (
    <div class="register">
      <div className="register-box">
        <h2 className="text-center text-info mb-4">Register</h2>
        <img
          src={logo}
          style={{ width: "150px", height: "150px" }}
          className="rounded mx-auto d-block rounded-circle"
        />
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username" className="text-info">
              Username*
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={user.username}
              onChange={handleChange}
            />

            <label htmlFor="email" className="text-info">
              Email*
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={user.email}
              onChange={handleChange}
            />

            <label htmlFor="password" className="text-info">
              Password*
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={user.password}
              onChange={handleChange}
            />

            <label htmlFor="confirmpassword" className="text-info">
              Confirm Password*
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={user.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="container flex gap-2 justify-content-center pt-4">
            <button type="submit" className="btn btn-primary gap-1" name="">
              Register
            </button>
            <button type="submit" name="" className="btn btn-success">
              <Link to="/login"> Login</Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
