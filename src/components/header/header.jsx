import React from "react";
import "./header.scss";
import { FiSearch, FiRefreshCcw, FiBell } from "react-icons/fi";

function Header() {
  return (
    <div className="header rad">
      {/* Search Bar */}
      <div className="search-box-container">
        <img src="/assets/Icon.png" />
        <input type="text" placeholder="Search here" className="search-box" />
      </div>

      {/* Right side icons and profile */}
      <div className="right-section">
        <div className="icon-wrapper">
          <img src="/assets/Frame 568.png" alt="avatar" />
        </div>
        <div className="icon-wrapper">
          <img src="/assets/Frame 548.png" alt="avatar" />
        </div>
        <div className="profile">
          <img src="/assets/3d_avatar_12.png" alt="avatar" />
          <div className="info">
            <h4>Admin</h4>
            <span>admin@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
