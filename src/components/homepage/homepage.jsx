import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../header/header";
import Aside from "../contentAside/contentAside";
import "./homepage.scss";

function HomePage() {
  return (
    <div className="container">
      <div>
        <Header />
      </div>
      <Aside />
      <main>
        <Outlet /> {/* This will render the routed content */}
      </main>
    </div>
  );
}

export default HomePage;
