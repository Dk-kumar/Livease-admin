import React, { useState } from "react";
import "./contentAside.scss";
import { FiGrid, FiSettings, FiLogOut } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const ContentAside = () => {
  const { pathname } = useLocation();

  // Menu data (can later come from API or config file)
  const [menuItems] = useState([
    { id: 1, label: "Dashboard", icon: "/assets/Vector.png", link: "/" },
    {
      id: 2,
      label: "Tenant Management",
      icon: "/assets/Vector.png",
      link: "/tenant-management",
    },
    {
      id: 3,
      label: "Landlord Management",
      icon: "/assets/Vector.png",
      link: "/landlord-management",
    },
    {
      id: 3,
      label: "Property Management",
      icon: "/assets/Vector.png",
      link: "/property-management",
    },
    {
      id: 4,
      label: "Maintenance Requests",
      icon: "/assets/Vector.png",
      link: "/maintenance-service",
    },
    {
      id: 5,
      label: "Payments & Wallet",
      icon: "/assets/Vector.png",
      link: "/wallet",
    },
    {
      id: 6,
      label: "Reports",
      icon: "/assets/Vector.png",
      link: "support-ticket",
    },
    { id: 7, label: "Analytics", icon: "/assets/Vector.png" },
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
          <Link to={item?.link}>
            <li
              key={item.id}
              className={item?.link === pathname ? "active" : ""}
            >
              <img src={item.icon} alt={item.label} className="menu-icon" />
              <span>{item.label}</span>
            </li>
          </Link>
        ))}
      </ul>

      {/* Footer actions */}
      <div className="footer">
        <div className="footer-item">
          <img src="/assets/Vector (1).png" alt="avatar" />
          <span>Settings</span>
        </div>
        <div className="footer-item logout">
          <img src="/assets/3d_avatar_12.png" alt="avatar" />
          <span>Log out</span>
        </div>
      </div>
    </div>
  );
};

export default ContentAside;
