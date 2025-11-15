import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardStats,
  getMatchingMetrics,
  getRecentActivity,
  getRecentSupportTickets,
  createServiceRequest,
  getUsersList,
  getProperties,
  addUser,
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
  
  // Maintenance request modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    requestId: '',
    user_id: '',
    property: '',
    dueDate: '',
    description: '',
    urgency: 'medium',
    cost: 0
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  // Add tenant modal state
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [tenantForm, setTenantForm] = useState({
    name: '',
    email: '',
    number: '',
    location: '',
    password: '',
    account_type: 'Tenant'
  });
  const [submittingTenant, setSubmittingTenant] = useState(false);
  const [tenantError, setTenantError] = useState('');
  const [tenantSuccess, setTenantSuccess] = useState('');

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

  // Maintenance request modal functions
  const generateRequestId = () => {
    return '#' + Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const handleOpenCreateModal = async () => {
    setShowCreateModal(true);
    setCreateError('');
    setCreateSuccess('');
    const newRequestId = generateRequestId();
    setCreateForm(prev => ({ ...prev, requestId: newRequestId }));
    
    try {
      const [tenantsRes, propertiesRes] = await Promise.all([
        getUsersList('Tenant', 1, 100),
        getProperties(1, 100)
      ]);
      if (tenantsRes?.users) {
        setTenants(tenantsRes.users);
      }
      if (propertiesRes?.properties) {
        setProperties(propertiesRes.properties);
      }
    } catch (error) {
      console.error('Error fetching tenants/properties:', error);
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateForm({
      requestId: '',
      user_id: '',
      property: '',
      dueDate: '',
      description: '',
      urgency: 'medium',
      cost: 0
    });
    setUploadedFiles([]);
    setCreateError('');
    setCreateSuccess('');
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleCreateSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setCreateError('');
    setCreateSuccess('');

    if (!createForm.property) {
      setCreateError('Please select a property.');
      return;
    }
    if (!createForm.description || createForm.description.trim() === '') {
      setCreateError('Description is required.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await createServiceRequest({
        user_id: createForm.user_id || '6871eac57ca16dab949e11e3',
        property: createForm.property,
        description: createForm.description.trim(),
        urgency: createForm.urgency,
        cost: parseFloat(createForm.cost) || 0
      });

      if (response) {
        setCreateSuccess('Maintenance request created successfully!');
        setTimeout(() => {
          handleCloseCreateModal();
          // Optionally refresh dashboard data
          fetchDashboardData();
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating request:', error);
      setCreateError(
        error.message || 'Failed to create request. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Add tenant modal functions
  const handleOpenAddTenantModal = () => {
    setShowAddTenantModal(true);
    setTenantError('');
    setTenantSuccess('');
    setTenantForm({
      name: '',
      email: '',
      number: '',
      location: '',
      password: '',
      account_type: 'Tenant'
    });
  };

  const handleCloseAddTenantModal = () => {
    setShowAddTenantModal(false);
    setTenantForm({
      name: '',
      email: '',
      number: '',
      location: '',
      password: '',
      account_type: 'Tenant'
    });
    setTenantError('');
    setTenantSuccess('');
  };

  const handleAddTenantSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setTenantError('');
    setTenantSuccess('');

    // Validation
    if (!tenantForm.name || !tenantForm.email || !tenantForm.number || !tenantForm.location || !tenantForm.password) {
      setTenantError('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tenantForm.email)) {
      setTenantError('Please enter a valid email address.');
      return;
    }

    try {
      setSubmittingTenant(true);
      const response = await addUser({
        name: tenantForm.name.trim(),
        email: tenantForm.email.trim(),
        number: tenantForm.number.trim(),
        location: tenantForm.location.trim(),
        password: tenantForm.password,
        account_type: 'Tenant'
      });

      if (response) {
        setTenantSuccess('Tenant created successfully!');
        setTimeout(() => {
          handleCloseAddTenantModal();
          // Refresh dashboard data
          fetchDashboardData();
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
      setTenantError(
        error.message || 'Failed to create tenant. Please try again.'
      );
    } finally {
      setSubmittingTenant(false);
    }
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
              onClick={handleOpenAddTenantModal}
              className="dashboard__btn dashboard__btn--outline"
            >
              + Add New Tenant
            </button>
            <button
              onClick={handleOpenCreateModal}
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

      {/* Create Maintenance Request Modal */}
      {showCreateModal && (
        <div
          className="create-request-modal-overlay"
          onClick={handleCloseCreateModal}>
          <div
            className="create-request-modal-content"
            onClick={e => e.stopPropagation()}>
            <div className="create-request-modal-header">
              <div className="create-request-header-left">
                <h2>Create Maintenance Request</h2>
                <p className="create-request-subtitle">
                  Create a new maintenance service request for a property.
                </p>
              </div>
              <button
                type="button"
                className="create-request-submit-btn"
                onClick={e => {
                  e.preventDefault();
                  handleCreateSubmit(e);
                }}
                disabled={submitting}>
                {submitting ? 'Creating...' : 'Create'}
              </button>
            </div>

            {createError && (
              <div className="create-request-error">{createError}</div>
            )}

            {createSuccess && (
              <div className="create-request-success">{createSuccess}</div>
            )}

            <form onSubmit={handleCreateSubmit} className="create-request-form">
              <div className="create-request-form-columns">
                {/* Left Column */}
                <div className="create-request-left-column">
                  <div className="create-request-form-group">
                    <label>Request ID</label>
                    <input
                      type="text"
                      value={createForm.requestId}
                      readOnly
                      className="create-request-readonly"
                    />
                  </div>

                  <div className="create-request-form-group">
                    <label>Property</label>
                    <select
                      value={createForm.property}
                      onChange={e =>
                        setCreateForm({
                          ...createForm,
                          property: e.target.value
                        })
                      }
                      required>
                      <option value="">Select Property</option>
                      {properties.map(prop => (
                        <option key={prop._id} value={prop._id}>
                          {prop.title || prop.address || prop._id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="create-request-form-group">
                    <label>Due Date</label>
                    <select
                      value={createForm.dueDate}
                      onChange={e =>
                        setCreateForm({
                          ...createForm,
                          dueDate: e.target.value
                        })
                      }
                      className="create-request-date-select">
                      <option value="">Select Date</option>
                      {Array.from({ length: 30 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i + 1);
                        const dateStr = date.toISOString().split('T')[0];
                        const formattedDate = date.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        });
                        return (
                          <option key={dateStr} value={dateStr}>
                            {formattedDate}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="create-request-right-column">
                  <div className="create-request-form-group">
                    <label>Description</label>
                    <textarea
                      value={createForm.description}
                      onChange={e =>
                        setCreateForm({
                          ...createForm,
                          description: e.target.value
                        })
                      }
                      placeholder="Describe the maintenance issue..."
                      rows="6"
                      className="create-request-textarea"
                      required
                    />
                  </div>

                  <div className="create-request-upload-section">
                    <button
                      type="button"
                      className="create-request-upload-btn"
                      onClick={() =>
                        document.getElementById('file-upload-input-dashboard').click()
                      }>
                      Upload Property Bill/Document
                      <span className="upload-icon">↑</span>
                    </button>
                    <input
                      id="file-upload-input-dashboard"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    {uploadedFiles.length > 0 && (
                      <div className="uploaded-files-list">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="uploaded-file-item">
                            <span className="uploaded-file-name">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="uploaded-file-remove">
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {showAddTenantModal && (
        <div
          className="create-request-modal-overlay"
          onClick={handleCloseAddTenantModal}>
          <div
            className="create-request-modal-content"
            onClick={e => e.stopPropagation()}>
            <div className="create-request-modal-header">
              <div className="create-request-header-left">
                <h2>Add New Tenant</h2>
                <p className="create-request-subtitle">
                  Create a new tenant account in the system.
                </p>
              </div>
              <button
                type="button"
                className="create-request-submit-btn"
                onClick={e => {
                  e.preventDefault();
                  handleAddTenantSubmit(e);
                }}
                disabled={submittingTenant}>
                {submittingTenant ? 'Creating...' : 'Create Tenant'}
              </button>
            </div>

            {tenantError && (
              <div className="create-request-error">{tenantError}</div>
            )}

            {tenantSuccess && (
              <div className="create-request-success">{tenantSuccess}</div>
            )}

            <form onSubmit={handleAddTenantSubmit} className="create-request-form">
              <div className="create-request-form-columns">
                {/* Left Column */}
                <div className="create-request-left-column">
                  <div className="create-request-form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={tenantForm.name}
                      onChange={e =>
                        setTenantForm({
                          ...tenantForm,
                          name: e.target.value
                        })
                      }
                      placeholder="Enter tenant name"
                      required
                    />
                  </div>

                  <div className="create-request-form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={tenantForm.email}
                      onChange={e =>
                        setTenantForm({
                          ...tenantForm,
                          email: e.target.value
                        })
                      }
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div className="create-request-form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      value={tenantForm.number}
                      onChange={e =>
                        setTenantForm({
                          ...tenantForm,
                          number: e.target.value
                        })
                      }
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="create-request-right-column">
                  <div className="create-request-form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      value={tenantForm.location}
                      onChange={e =>
                        setTenantForm({
                          ...tenantForm,
                          location: e.target.value
                        })
                      }
                      placeholder="Enter location"
                      required
                    />
                  </div>

                  <div className="create-request-form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      value={tenantForm.password}
                      onChange={e =>
                        setTenantForm({
                          ...tenantForm,
                          password: e.target.value
                        })
                      }
                      placeholder="Enter password"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
