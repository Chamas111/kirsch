import { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import axios from "../../axiosinstance";
import logo from "../navbar/fotos/logo.svg";
import "./navbar.css";

function Navbar({ isLoggedin, setIsLoggedin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");

  // Fetch logged-in user
  useEffect(() => {
    if (isLoggedin) {
      axios
        .get("auth/loggedin-user")
        .then((res) => setUser(res.data))
        .catch((err) => console.log(err.response?.data));
    }
  }, [isLoggedin]);

  // Search input handling
  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      setQuery(params.get("query") || "");
    } else {
      setQuery("");
    }
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    axios
      .post("auth/logout", {}, { withCredentials: true })
      .then(() => {
        setIsLoggedin(false);
        navigate("/login");
      })
      .catch((err) => console.log(err.response?.data));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container-fluid">
        {/* Logo always on left */}
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Logo"
            className="img-fluid rounded-circle"
            width="48"
            height="48"
          />
        </NavLink>

        {/* Toggler on right */}
        <button
          className="navbar-toggler ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarContent"
        >
          {/* Search box */}
          <form className="d-flex my-2 my-lg-0" onSubmit={handleSearch}>
            <input
              type="search"
              className="form-control me-2"
              placeholder="Suche..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          {/* User controls */}
          <div className="ms-lg-auto d-flex align-items-center gap-2 my-2 my-lg-0">
            {isLoggedin ? (
              <>
                {user && (
                  <div className="d-flex align-items-center gap-2">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="rounded-circle"
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          fontWeight: "bold",
                        }}
                      >
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="fw-bold text-white">{user.username}</span>
                  </div>
                )}
                <button className="btn btn-primary ms-2" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className="btn btn-success me-2" to="/login">
                  Sign In
                </NavLink>
                <NavLink className="btn btn-primary" to="/register">
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
