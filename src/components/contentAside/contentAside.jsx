import React, { useState } from "react";
import "./contentAside.scss";
import { FiGrid, FiSettings, FiLogOut } from "react-icons/fi";

const ContentAside = () => {
  // Menu data (can later come from API or config file)
  const [menuItems] = useState([
    { id: 1, label: "Dashboard",icon: "/assets/Vector.png", active: true },
    { id: 2, label: "User Management", icon: "/assets/Vector.png" },
    { id: 3, label: "Payments & Wallet", icon: "/assets/Vector.png" },
    { id: 4, label: "Reports", icon: "/assets/Vector.png" },
    { id: 5, label: "Analytics", icon: "/assets/Vector.png" },
  ]);

  return (
    <div className="sidebar rad">
      {/* Logo */}
      <div className="logo">
        <img
          src="/assets/Frame 322.png" // dummy logo, replace later
          alt="logo"
        />
      </div>

      {/* Menu */}
      <ul className="menu">
        {menuItems.map((item) => (
          <li key={item.id} className={item.active ? "active" : ""}>
            <img src={item.icon} alt={item.label} className="menu-icon" />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      {/* Footer actions */}
      <div className="footer">
        <div className="footer-item">
          <img
            src="/assets/Vector (1).png"
            alt="avatar"
          />
          <span>Settings</span>
        </div>
        <div className="footer-item logout">
          <img
            src="/assets/3d_avatar_12.png"
            alt="avatar"
          />
          <span>Log out</span>
        </div>
      </div>
    </div>
  );
}

export default ContentAside;
