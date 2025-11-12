import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardStats,
  getMatchingMetrics,
  getRecentActivity,
  getRecentSupportTickets,
} from "../../server/index";
import "./dashboard.scss";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState([
    {
      title: "Total Tenant",
      value: "0",
      trend: "Loading...",
      trendType: "up",
      trendColor: "green",
      bg: "dashboard__card--primary",
    },
    {
      title: "Total Landlords",
      value: "0",
      trend: "Loading...",
      trendType: "up",
      trendColor: "green",
      bg: "",
    },
    {
      title: "Total Properties",
      value: "0",
      trend: "Loading...",
      trendType: "up",
      trendColor: "green",
      bg: "",
    },
    {
      title: "Total Payments",
      value: "0",
      trend: "Loading...",
      trendType: "up",
      trendColor: "green",
      bg: "",
    },
  ]);

  const [matchingMetrics, setMatchingMetrics] = useState([
    {
      title: "Total Matches",
      value: "0",
      trend: "Loading...",
      trendType: "up",
      trendColor: "green",
    },
    {
      title: "Superlikes Sent",
      value: "0",
      trend: "Loading...",
      trendType: "up",
      trendColor: "green",
    },
    {
      title: "Properties Shared",
      value: "0",
      trend: "Loading...",
      trendType: "up",
      trendColor: "green",
    },
  ]);

  const [supportTickets, setSupportTickets] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data in parallel
      const [statsData, metricsData, activityData, ticketsData] = await Promise.all([
        getDashboardStats(),
        getMatchingMetrics(),
        getRecentActivity(10),
        getRecentSupportTickets(5),
      ]);

      // Update stats - handle both response formats (data.data or data directly)
      const statsResponse = statsData?.data || statsData;
      if (statsResponse) {
        const formattedStats = [
          {
            title: "Total Tenant",
            value: statsResponse.total_tenants?.toLocaleString() || "0",
            trend: "Total tenants",
            trendType: "up",
            trendColor: "green",
            bg: "dashboard__card--primary",
          },
          {
            title: "Total Landlords",
            value: statsResponse.total_landlords?.toLocaleString() || "0",
            trend: "Total landlords",
            trendType: "up",
            trendColor: "green",
            bg: "",
          },
          {
            title: "Total Properties",
            value: statsResponse.total_properties?.toLocaleString() || "0",
            trend: "Total properties",
            trendType: "up",
            trendColor: "green",
            bg: "",
          },
          {
            title: "Total Payments",
            value: formatCurrency(statsResponse.total_payments || 0),
            trend: "Total payments",
            trendType: "up",
            trendColor: "green",
            bg: "",
          },
        ];
        setStats(formattedStats);
      }

      // Update matching metrics
      const metricsResponse = metricsData?.data || metricsData;
      if (metricsResponse) {
        const formattedMetrics = [
          {
            title: "Total Matches",
            value: metricsResponse.total_matches?.toLocaleString() || "0",
            trend: "Accepted matches",
            trendType: "up",
            trendColor: "green",
          },
          {
            title: "Superlikes Sent",
            value: metricsResponse.total_superlikes?.toLocaleString() || "0",
            trend: "Total superlikes",
            trendType: "up",
            trendColor: "green",
          },
          {
            title: "Properties Shared",
            value: metricsResponse.properties_shared?.toLocaleString() || "0",
            trend: "Properties liked/shared",
            trendType: "up",
            trendColor: "green",
          },
        ];
        setMatchingMetrics(formattedMetrics);
      }

      // Update activities
      const activityResponse = activityData?.data || activityData;
      if (activityResponse && Array.isArray(activityResponse)) {
        const formattedActivities = activityResponse.map((activity) => ({
          img: activity.profile_pic || "/assets/3d_avatar_1.png",
          name: activity.name,
          action: activity.action,
          time: formatTime(activity.time),
        }));
        setActivities(formattedActivities);
      }

      // Update support tickets
      const ticketsResponse = ticketsData?.data || ticketsData;
      if (ticketsResponse && Array.isArray(ticketsResponse)) {
        setSupportTickets(ticketsResponse);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleTicketClick = (ticketId) => {
    navigate(`/support-ticket/${ticketId}`);
  };

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
                {loading ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>Loading tickets...</div>
                ) : supportTickets.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>No tickets found</div>
                ) : (
                  supportTickets.map((ticket, idx) => (
                    <div key={idx} className="dashboard__ticket-row">
                      <span style={{ borderLeft: `4px solid ${ticket.color}`, padding: '23px 8px' }}>
                        {ticket.text}
                      </span>
                      <button 
                        className="dashboard__ticket-btn"
                        onClick={() => handleTicketClick(ticket.id)}
                      >
                        Open Ticket
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div 
                className="dashboard__tickets-viewmore"
                onClick={() => navigate("/support-ticket")}
                style={{ cursor: 'pointer' }}
              >
                View More
              </div>
            </div>
          </div>
          {/* Right Column: Recent Activity */}
          <div className="dashboard__activity">
            <h2 className="dashboard__metrics-title">Recent Activity</h2>
            <div className="dashboard__activity-list">
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading activities...</div>
              ) : activities.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>No recent activity</div>
              ) : (
                activities.map((activity, idx) => (
                  <div key={idx} className="dashboard__activity-row">
                    <img
                      src={activity.img}
                      alt="user"
                      className="dashboard__activity-avatar"
                      onError={(e) => {
                        e.target.src = "/assets/3d_avatar_1.png";
                      }}
                    />
                    <div className="dashboard__activity-info">
                      <div className="dashboard__activity-name">{activity.name}</div>
                      <div className="dashboard__activity-action">{activity.action}</div>
                    </div>
                    <div className="dashboard__activity-time">{activity.time}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
