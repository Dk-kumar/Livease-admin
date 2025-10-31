import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./maintenanceService.scss";
import { getMaintenanceRequests } from "../../server";
function MaintenanceService() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const recordsPerPage = 10;

  // Fetch maintenance requests from API
  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getMaintenanceRequests(page, recordsPerPage);
      if (res?.requests) {
        const mapped = res.requests.map((r) => ({
          _id: r._id,
          id: r._id,
          tenant: r.tenant?.name || "N/A",
          property: r.property?.title || "N/A",
          summary: r.description || "N/A",
          urgency: r.urgency || "N/A",
          status: r.status || "N/A",
          response: r.landlord?.name || "N/A",
        }));
        setRequests(mapped);
        setFilteredRequests(mapped);
        setTotalPages(res.total_pages || 1);
        setCurrentPage(res.current_page || page);
      } else {
        setRequests([]);
        setFilteredRequests([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Failed to fetch maintenance requests", err);
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Search/filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRequests(requests);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = requests.filter((r) => {
      return (
        (r.id || "").toString().toLowerCase().includes(q) ||
        (r.tenant || "").toLowerCase().includes(q) ||
        (r.property || "").toLowerCase().includes(q) ||
        (r.summary || "").toLowerCase().includes(q) ||
        (r.urgency || "").toLowerCase().includes(q) ||
        (r.status || "").toLowerCase().includes(q) ||
        (r.response || "").toLowerCase().includes(q)
      );
    });
    setFilteredRequests(filtered);
  }, [searchQuery, requests]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="maintenance-service-page">
      <div className="maintenance-service-header-row">
        <div>
          <h1>Maintenance Service Requests</h1>
          <p>Manage Your Task and Activities.</p>
        </div>
        <button className="create-btn">
          <img src="/assets/icon (1).png"></img> Create Request
        </button>
      </div>
      <div className="maintenance-service-table-controls">
        <input
          className="maintenance-service-search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* <div className="maintenance-service-table-filters">
          <button>Provider ▼</button>
          <button>Urgency ▼</button>
          <button>Status ▼</button>
        </div> */}
      </div>
      <div className="maintenance-service-table-wrapper">
        <table className="maintenance-service-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Request ID</th>
              <th>Tenant</th>
              <th>Property</th>
              <th>Issue Summary</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Landlord Response</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9}>Loading...</td>
              </tr>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((req, idx) => (
                <tr key={req._id || idx}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <Link to={`/maintenance-details?id=${encodeURIComponent(
                      req._id || req.id
                    )}`}>{req.id}</Link>
                  </td>
                  <td>
                    <Link to={`/maintenance-details?id=${encodeURIComponent(
                      req._id || req.id
                    )}`}>{req.tenant}</Link>
                  </td>
                  <td>
                    <Link to={`/maintenance-details?id=${encodeURIComponent(
                      req._id || req.id
                    )}`}>{req.property}</Link>
                  </td>
                  <td>
                    <Link to={`/maintenance-details?id=${encodeURIComponent(
                      req._id || req.id
                    )}`}>{req.summary}</Link>
                  </td>
                  <td>
                    <Link to={`/maintenance-details?id=${encodeURIComponent(
                      req._id || req.id
                    )}`}>{req.urgency}</Link>
                  </td>
                  <td>
                    <span
                      className={
                        req.status
                      }
                    >
                      {req.status}
                    </span>
                  </td>
                  <td>{req.response}</td>
                  <td style={{ position: "relative" }}>
                    <button
                      className="maintenance-service-dots"
                      onClick={() => setMenuOpen(menuOpen === idx ? null : idx)}
                    >
                      ⋮
                    </button>
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
              ))
            ) : (
              <tr>
                <td colSpan={9}>No data found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="maintenance-service-pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceService;
