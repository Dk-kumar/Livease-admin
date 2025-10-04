import React, { useState } from "react";
import "./PropertyCheckUps.scss";

function PropertyCheckUps() {
const [search, setSearch] = useState("");

// Store data in state
const [data, setData] = useState([
{
id: 75000,
landlord: "Ramesh Sharma",
tenant: "Ramesh Sharma",
property: "3-BHK Farm...",
dueDate: "07/07/2025",
status: "Pending",
urgency: "High",
approved: "Yes",
},
{
id: 75001,
landlord: "Ramesh Sharma",
tenant: "Ramesh Sharma",
property: "3-BHK Farm...",
dueDate: "—",
status: "Completed",
urgency: "Medium",
approved: "No",
},
{
id: 75002,
landlord: "Ramesh Sharma",
tenant: "Ramesh Sharma",
property: "3-BHK Farm...",
dueDate: "—",
status: "Active",
urgency: "Low",
approved: "Yes",
},
{
id: 75003,
landlord: "Ramesh Sharma",
tenant: "Ramesh Sharma",
property: "3-BHK Farm...",
dueDate: "—",
status: "Rejected",
urgency: "High",
approved: "No",
},
{
id: 75004,
landlord: "Ramesh Sharma",
tenant: "Ramesh Sharma",
property: "3-BHK Farm...",
dueDate: "—",
status: "Inactive",
urgency: "Medium",
approved: "Yes",
},
]);

// Filter rows based on search
const filteredData = data.filter(
(row) =>
row.tenant.toLowerCase().includes(search.toLowerCase()) ||
row.landlord.toLowerCase().includes(search.toLowerCase()) ||
row.property.toLowerCase().includes(search.toLowerCase())
);

return ( <div className="checkups">
{/* Header */} <div className="checkups__header"> <div> <h2 className="checkups__title">Property Check-Ups</h2> <p className="checkups__subtitle">Manage Your Task and Activities.</p> </div> <div className="checkups__header-actions"> <button className="btn btn--primary">Submit Response</button> <button className="btn btn--secondary">Create Request</button> </div> </div>

```
  {/* Search + Filters */}
  <div className="checkups__controls">
    <input
      type="text"
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <div className="filters">
      <select>
        <option>Status</option>
        <option>Active</option>
        <option>Pending</option>
        <option>Completed</option>
        <option>Rejected</option>
        <option>Inactive</option>
      </select>
      <select>
        <option>Urgency</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
    </div>
  </div>

  {/* Table */}
  <table className="checkups__table">
    <thead>
      <tr>
        <th><input type="checkbox" /></th>
        <th>Request ID</th>
        <th>Landlord</th>
        <th>Tenant</th>
        <th>Property</th>
        <th>Due Date</th>
        <th>Status</th>
        <th>Urgency</th>
        <th>Approved</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {filteredData.map((row) => (
        <tr key={row.id}>
          <td><input type="checkbox" /></td>
          <td>{row.id}</td>
          <td>{row.landlord}</td>
          <td>{row.tenant}</td>
          <td>{row.property}</td>
          <td>{row.dueDate}</td>
          <td>
            <span className={`status status--${row.status.toLowerCase()}`}>
              {row.status}
            </span>
          </td>
          <td>{row.urgency}</td>
          <td>{row.approved}</td>
          <td>
            <button className="action-btn">⋮</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Footer */}
  <div className="checkups__footer">
    <span>1 of 100</span>
    <button className="btn btn--secondary">Next &gt;</button>
  </div>
</div>

);
}

export default PropertyCheckUps;
