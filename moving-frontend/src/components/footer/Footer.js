import React from "react";
import logo from "../../components/navbar/fotos/logo.svg";
import { NavLink } from "react-router-dom";
import "./footer.css";

function Footer() {
  return (
    <footer className="text-center text-white footer-bg">
      {/* Top section with logo */}
      <div className="footer-flex">
        <NavLink className="navbar-brand" to="/">
          <img className="img-fluid rounded-circle" src={logo} alt="Logo" />
        </NavLink>
      </div>

      {/* Bottom copyright bar */}
      <div
        className="text-center copyright"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        © 2025 Copyright:{" "}
        <a className="text-white" href="https://mdbootstrap.com/">
          Ahmad Chamas
        </a>
      </div>
    </footer>
  );
}

export default Footer;
