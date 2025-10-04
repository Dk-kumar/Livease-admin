import React, { useState } from 'react';
import './maintenanceService.scss';

const requestsData = [
  {
    id: 75000,
    tenant: 'Ramesh Sharma',
    property: '3-BHK Farm...',
    summary: 'Plumbing issue',
    urgency: 'High',
    status: 'Active',
    response: 'Approved',
  },
  {
    id: 75000,
    tenant: 'Ramesh Sharma',
    property: '3-BHK Farm...',
    summary: '25,000/1,25,000',
    urgency: 'Medium',
    status: 'Inactive',
    response: 'Medium',
  },
  {
    id: 75000,
    tenant: 'Ramesh Sharma',
    property: '3-BHK Farm...',
    summary: '25,000/1,25,000',
    urgency: 'Low',
    status: 'Active',
    response: 'Low',
  },
  {
    id: 75000,
    tenant: 'Ramesh Sharma',
    property: '3-BHK Farm...',
    summary: '25,000/1,25,000',
    urgency: 'Low',
    status: 'Inactive',
    response: 'High',
  },
  {
    id: 75000,
    tenant: 'Ramesh Sharma',
    property: '3-BHK Farm...',
    summary: '25,000/1,25,000',
    urgency: 'Medium',
    status: 'Active',
    response: 'Medium',
  },
  {
    id: 75000,
    tenant: 'Ramesh Sharma',
    property: '3-BHK Farm...',
    summary: '25,000/1,25,000',
    urgency: 'Low',
    status: 'Inactive',
    response: 'Low',
  },
  {
    id: 75000,
    tenant: 'Ramesh Sharma',
    property: '3-BHK Farm...',
    summary: '25,000/1,25,000',
    urgency: 'High',
    status: 'Active',
    response: 'High',
  },
  {
    id: 75000,
    tenant: 'Ramesh Sharma',
    property: '3-BHK Farm...',
    summary: '25,000/1,25,000',
    urgency: 'Medium',
    status: 'Inactive',
    response: 'Medium',
  },
  {
    id: 75000,
    tenant: 'Ramesh Sharma',
    property: '3-BHK Farm...',
    summary: '25,000/1,25,000',
    urgency: 'Low',
    status: 'Active',
    response: 'Low',
  },
  {
    id: 75000,
    tenant: 'Ramesh Sharma',
    property: '3-BHK Farm...',
    summary: '25,000/1,25,000',
    urgency: 'High',
    status: 'Inactive',
    response: 'High',
  },
];

function MaintenanceService() {
  const [requests] = useState(requestsData);
  const [menuOpen, setMenuOpen] = useState(null);

  return (
    <div className="maintenance-service-page">
      <div className="maintenance-service-header-row">
        <div>
          <h1>Maintenance Service Requests</h1>
          <p>Manage Your Task and Activities.</p>
        </div>
        <button className="create-btn"><img src='/assets/icon (1).png'></img>  Create Request</button>
      </div>
      <div className="maintenance-service-table-controls">
        <input className="maintenance-service-search" placeholder="Search" />
        <div className="maintenance-service-table-filters">
          <button>Provider ▼</button>
          <button>Urgency ▼</button>
          <button>Status ▼</button>
        </div>
      </div>
      <div className="maintenance-service-table-wrapper">
        <table className="maintenance-service-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Request ID</th>
              <th>Tenant</th>
              <th>Property</th>
              <th>Issue Summary</th>
              <th>Urgency</th>
              <th>Statu</th>
              <th>Landlord Response</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, idx) => (
              <tr key={idx}>
                <td><input type="checkbox" /></td>
                <td>{req.id}</td>
                <td>{req.tenant}</td>
                <td>{req.property}</td>
                <td>{req.summary}</td>
                <td>{req.urgency}</td>
                <td>
                  <span className={
                    req.status === 'Active'
                      ? 'status-active'
                      : 'status-inactive'
                  }>
                    {req.status}
                  </span>
                </td>
                <td>{req.response}</td>
                <td style={{ position: 'relative' }}>
                  <button
                    className="maintenance-service-dots"
                    onClick={() => setMenuOpen(menuOpen === idx ? null : idx)}
                  >⋮</button>
                  {menuOpen === idx && (
                    <div className="maintenance-service-dropdown">
                      <button>✏️ Edit Request</button>
                      <button>● Assign Provider</button>
                      <button>● Resolve</button>
                      <button>🔔 Send Reminder</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="maintenance-service-pagination">
          1 of 100 <span className="maintenance-service-next">Next &gt;</span>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceService;