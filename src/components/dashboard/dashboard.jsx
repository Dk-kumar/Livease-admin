import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.scss";

function Dashboard() {
  const navigate = useNavigate();

  const [stats] = useState([
    {
      title: "Total Tenant",
      value: "1586",
      trend: "increases last month",
      trendType: "up",
      trendColor: "green",
      bg: "dashboard__card--primary",
    },
    {
      title: "Total Landlords",
      value: "1984",
      trend: "increases last month",
      trendType: "up",
      trendColor: "green",
      bg: "",
    },
    {
      title: "Total Properties",
      value: "2003",
      trend: "increases last month",
      trendType: "down",
      trendColor: "red",
      bg: "",
    },
    {
      title: "Total Payments",
      value: "57,08,000",
      trend: "increases last month",
      trendType: "up",
      trendColor: "green",
      bg: "",
    },
  ]);

  const matchingMetrics = [
    {
      title: "Total Matches",
      value: "1209",
      trend: "increases last month",
      trendType: "up",
      trendColor: "green",
    },
    {
      title: "Superlikes Sent",
      value: "579",
      trend: "increases last month",
      trendType: "up",
      trendColor: "green",
    },
    {
      title: "Properties Shared",
      value: "777",
      trend: "In last 30 Days",
      trendType: "up",
      trendColor: "green",
    },
  ];

  const supportTickets = [
    { text: 'Urgent: Payment Issue - Ticket #1234', color: 'red' },
    { text: 'Urgent: Payment Issue - Ticket #1234', color: 'orange' },
    { text: 'Urgent: Payment Issue - Ticket #1234', color: 'blue' },
  ];

  const activities = [
    { img: "/assets/3d_avatar_1.png", name: "Jitesh R. Sharma", action: "New Tennent", time: "10:08 AM" },
    { img: "assets/3d_avatar_1.png", name: "Jitesh R. Sharma", action: "New Landlord", time: "10:08 AM" },
    { img: "/assets/3d_avatar_1.png", name: "Jitesh R. Sharma", action: "New Tennent", time: "10:08 AM" },
    { img: "/assets/3d_avatar_1.png", name: "Jitesh R. Sharma", action: "New Tennent", time: "10:08 AM" },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__main-row">
        {/* Left Section */}
        <div className="dashboard__left">
          <div>
            <h1 className="dashboard__title">Dashboard</h1>
            <p className="dashboard__subtitle">Manage Your Task and Activities.</p>
          </div>
          {/* Right Section - Buttons */}
          <div className="dashboard__actions">
            <button
              onClick={() => navigate("/add-property")}
              className="dashboard__btn dashboard__btn--primary"
            >
              + Add Property
            </button>
            <button
              onClick={() => navigate("/add-tenant")}
              className="dashboard__btn dashboard__btn--outline"
            >
              + Add New Tenant
            </button>
            <button
              onClick={() => navigate("/maintenance")}
              className="dashboard__btn dashboard__btn--outline"
            >
              + Maintenance Request
            </button>
          </div>
        </div>
        {/* Cards Section */}
        <div className="dashboard__cards">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className={`dashboard__card ${item.bg}`}
            >
              <div className="dashboard__card-header">
                <span>{item.title}</span>
                <img src="/assets/Frame 525.png" alt="arrow" />
              </div>
              <div className="dashboard__card-value">{item.value}</div>
              <div
                className="dashboard__card-trend"
                style={{ color: item.trendColor }}
              >
                {item.trendType === "up" ? "▲" : "▼"} {item.trend}
              </div>
            </div>
          ))}
        </div>
        {/* New Section Below Cards */}
        <div className="dashboard__metrics-row">
          {/* Left Column: Matching Metrics & Support Tickets stacked */}
          <div className="dashboard__metrics-left">
            <div className="dashboard__metrics-cardbox">
              <h2 className="dashboard__metrics-title">Matching Metrics</h2>
              <div className="dashboard__metrics-cards">
                {matchingMetrics.map((item, idx) => (
                  <div key={idx} className="dashboard__metrics-card">
                    <div className="dashboard__metrics-card-title">{item.title}</div>
                    <div className="dashboard__metrics-card-value">{item.value}</div>
                    <div
                      className="dashboard__metrics-card-trend"
                      style={{ color: item.trendColor }}
                    >
                      {item.trendType === "up" ? "▲" : "▼"} {item.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dashboard__metrics-cardbox" style={{ marginTop: '20px' }}>
              <h2 className="dashboard__metrics-title">Support Tickets</h2>
              <div className="dashboard__tickets">
                {supportTickets.map((ticket, idx) => (
                  <div key={idx} className="dashboard__ticket-row">
                    <span style={{ borderLeft: `4px solid ${ticket.color}`, padding: '23px 8px' }}>
                      {ticket.text}
                    </span>
                    <button className="dashboard__ticket-btn">Open Ticket</button>
                  </div>
                ))}
              </div>
              <div className="dashboard__tickets-viewmore">View More</div>
            </div>
          </div>
          {/* Right Column: Recent Activity */}
          <div className="dashboard__activity">
            <h2 className="dashboard__metrics-title">Recent Activity</h2>
            <div className="dashboard__activity-list">
              {activities.map((activity, idx) => (
                <div key={idx} className="dashboard__activity-row">
                  <img
                    src={activity.img}
                    alt="user"
                    className="dashboard__activity-avatar"
                  />
                  <div className="dashboard__activity-info">
                    <div className="dashboard__activity-name">{activity.name}</div>
                    <div className="dashboard__activity-action">{activity.action}</div>
                  </div>
                  <div className="dashboard__activity-time">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
