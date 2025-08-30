import React, { useState } from "react";
import "./menu.css";

import { Link } from "react-router-dom";
import { menu } from "../../data";

function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Burger Button sichtbar nur auf Mobile */}
      <button className="menu-toggle" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <div className={`menu  ${open ? "open" : ""}`}>
        {menu[0].listItems.map((item) => (
          <div className="item" key={item.id}>
            <Link
              to={item.url}
              className="title listItem "
              onClick={() => setOpen(false)}
            >
              <img src={item.icon} alt="" /> {item.title}
            </Link>

            {item.subItems && (
              <div className="title" style={{ paddingLeft: "20px" }}>
                {item.subItems.map((sub) => (
                  <Link
                    className="listItem"
                    key={sub.id}
                    to={sub.url}
                    onClick={() => setOpen(false)}
                  >
                    <img src={sub.icon} alt="" /> {sub.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Menu;
