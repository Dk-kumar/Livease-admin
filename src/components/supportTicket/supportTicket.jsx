import React, { useState } from "react";
import "./supportTicket.scss";

const ticketsData = [
  {
    ticketNo: "#32416552",
    user: "Ramesh Sharma",
    avatar: "/assets/3d_avatar_1.png",
    summary: "Payment Issue",
    lastMsg: "11:20 AM IST, May 28, 2025",
    status: "Resolved",
  },
  {
    ticketNo: "#32416552",
    user: "Ramesh Sharma",
    avatar: "/assets/3d_avatar_1.png",
    summary: "Verification Problem",
    lastMsg: "11:20 AM IST, May 28, 2025",
    status: "Active",
  },
  {
    ticketNo: "#32416552",
    user: "Ramesh Sharma",
    avatar: "/assets/3d_avatar_1.png",
    summary: "Payment Issue",
    lastMsg: "11:20 AM IST, May 28, 2025",
    status: "Active",
  },
  {
    ticketNo: "#32416552",
    user: "Ramesh Sharma",
    avatar: "/assets/3d_avatar_1.png",
    summary: "Verification Problem",
    lastMsg: "11:20 AM IST, May 28, 2025",
    status: "Inactive",
  },
  {
    ticketNo: "#32416552",
    user: "Ramesh Sharma",
    avatar: "/assets/3d_avatar_1.png",
    summary: "Payment Issue",
    lastMsg: "11:20 AM IST, May 28, 2025",
    status: "Active",
  },
  {
    ticketNo: "#32416552",
    user: "Ramesh Sharma",
    avatar: "/assets/3d_avatar_1.png",
    summary: "Verification Problem",
    lastMsg: "11:20 AM IST, May 28, 2025",
    status: "Inactive",
  },
  {
    ticketNo: "#32416552",
    user: "Ramesh Sharma",
    avatar: "/assets/3d_avatar_1.png",
    summary: "Payment Issue",
    lastMsg: "11:20 AM IST, May 28, 2025",
    status: "Active",
  },
  {
    ticketNo: "#32416552",
    user: "Ramesh Sharma",
    avatar: "/assets/3d_avatar_1.png",
    summary: "Verification Problem",
    lastMsg: "11:20 AM IST, May 28, 2025",
    status: "Inactive",
  },
  {
    ticketNo: "#32416552",
    user: "Ramesh Sharma",
    avatar: "/assets/3d_avatar_1.png",
    summary: "Payment Issue",
    lastMsg: "11:20 AM IST, May 28, 2025",
    status: "Active",
  },
  {
    ticketNo: "#32416552",
    user: "Ramesh Sharma",
    avatar: "/assets/3d_avatar_1.png",
    summary: "Verification Problem",
    lastMsg: "11:20 AM IST, May 28, 2025",
    status: "Inactive",
  },
];

function SupportTicket() {
  const [tickets] = useState(ticketsData);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editModal, setEditModal] = useState({ open: false, ticket: null });

  return (
    <div className="support-ticket-page">
      <div className="support-ticket-header-row">
        <div>
          <h1>Support Ticket</h1>
          <p>Manage Your Task and Activities.</p>
        </div>
        <div className="support-ticket-header-actions">
          <button className="add-btn">
            <img src="/assets/icon (1).png"></img> Add Ticket
          </button>
          <button className="export-btn">
            <img src="/assets/icon (2).png"></img> Export Data
          </button>
        </div>
      </div>
      <div className="support-ticket-table-controls">
        <input className="support-ticket-search" placeholder="Search" />
        <div className="support-ticket-table-filters">
          <button>
            <img src="/assets/Icon (2).png"></img>
            <span>Date</span>
          </button>
          <button>
            <img src="/assets/Icon (3).png"></img>
            <span>Filter</span>
          </button>
          <button>
            <img src="/assets/icondownarrow.png"></img>
            <span>Status</span>
          </button>
        </div>
      </div>
      <div className="support-ticket-table-wrapper">
        <table className="support-ticket-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Ticket No.</th>
              <th>User Name</th>
              <th>Summary</th>
              <th>Last Message</th>
              <th>Status</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, idx) => (
              <tr key={idx}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{ticket.ticketNo}</td>
                <td>
                  <img
                    src={ticket.avatar}
                    alt="avatar"
                    className="support-ticket-avatar"
                  />
                  {ticket.user}
                </td>
                <td>{ticket.summary}</td>
                <td>{ticket.lastMsg}</td>
                <td>
                  <span
                    className={
                      ticket.status === "Active"
                        ? "status-active"
                        : ticket.status === "Inactive"
                        ? "status-inactive"
                        : "status-resolved"
                    }
                  >
                    {ticket.status}
                  </span>
                </td>
                <td style={{ position: "relative" }}>
                  <button
                    className="support-ticket-dots"
                    onClick={() => setMenuOpen(menuOpen === idx ? null : idx)}
                  >
                    ⋮
                  </button>
                  {menuOpen === idx && (
                    <div className="support-ticket-dropdown">
                      <button
                        onClick={() => {
                          setEditModal({ open: true, ticket });
                          setMenuOpen(null);
                        }}
                      >
                        Edit Details
                      </button>
                      <button>Mark Resolved</button>
                      <button>Archive issue</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="support-ticket-pagination">
          1 of 100 <span className="support-ticket-next">Next &gt;</span>
        </div>
      </div>

      {/* Modal */}
      {editModal.open && (
        <div
          className="support-ticket-modal-overlay"
          onClick={() => setEditModal({ open: false, ticket: null })}
        >
          <div
            className="support-ticket-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Add Ticket</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor.
            </p>
            <div className="modal-form-row">
              <div className="modal-form-group">
                <label>Ticket No.</label>
                <input type="text" value={editModal.ticket.ticketNo} readOnly />
              </div>
              <div className="modal-form-group">
                <label>Description</label>
                <textarea defaultValue={editModal.ticket.summary}></textarea>
              </div>
            </div>
            <div className="modal-form-row">
              <div className="modal-form-group">
                <label>Raised by</label>
                <input type="text" value="Sankket Hirlekar" readOnly />
              </div>
              <div className="modal-form-group">
                <label>Category</label>
                <select defaultValue={editModal.ticket.summary}>
                  <option>Payment Issue</option>
                  <option>Verification Problem</option>
                </select>
              </div>
              <button className="modal-upload-btn">
                Upload Property Bill/Document ⬆️
              </button>
            </div>
            <div className="modal-actions">
              <button className="modal-submit-btn">Submit</button>
            </div>
            <button
              className="modal-close-btn"
              onClick={() => setEditModal({ open: false, ticket: null })}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupportTicket;
