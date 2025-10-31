import React, { useState, useEffect } from "react";
import "./maintenanceDetails.scss";
import { getMaintenanceRequestsById } from "../../server";
import ImagePreview from "../comman/ImagePreview/ImagePreview";
import { Link } from "react-router-dom";

function MaintenanceDetails() {
  const [requestDetails, setRequestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        // read id from URL query param: ?id=...
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        if (!id) {
          setError("Missing id in URL");
          setLoading(false);
          return;
        }

        const data = await getMaintenanceRequestsById(id);
        setRequestDetails(data || null);
      } catch (err) {
        console.error("Failed to fetch maintenance request", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, []);

  // Image preview is handled by the reusable ImagePreview component

  if (loading) {
    return (
      <div className="maintenance-details-page">
        <h1>Maintenance Details</h1>
        <p className="subtitle">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="maintenance-details-page">
        <h1>Maintenance Details</h1>
        <p className="subtitle">{error}</p>
      </div>
    );
  }

  // If no requestDetails found, show a friendly message
  if (!requestDetails) {
    return (
      <div className="maintenance-details-page">
        <h1>Maintenance Details</h1>
        <p className="subtitle">No maintenance request found.</p>
      </div>
    );
  }

  // Map response values
  const reporter = requestDetails.tenant || requestDetails.landlord || {};
  const reporterName = reporter.name || "Unknown User";
  const reporterAvatar = reporter.profile_pic || "/assets/3d_avatar_1.png";
  const property = requestDetails.property || {};
  const address = property.address || {};
  const addressLines = [];
  if (address.street) addressLines.push(address.street);
  if (address.city) addressLines.push(address.city);
  if (address.state) addressLines.push(address.state);
  const addressDisplay = addressLines.join(", ") || "Default address";
  const isUrgent = (requestDetails.urgency || "").toLowerCase() === "high";
  const statusLabel = requestDetails.status || "pending";
  const description = requestDetails.description || "";
  const images =
    Array.isArray(requestDetails.images) && requestDetails.images.length
      ? requestDetails.images
      : [];
  const cost = requestDetails.cost || 0;

  return (
    <div className="maintenance-details-page">
      <h1>Maintenance Details</h1>
      <p className="subtitle">Manage Your Task and Activities.</p>
      <div className="maintenance-details-card">
        <div className="maintenance-details-header">
          <img src={reporterAvatar} alt="avatar" className="avatar" />
          <div className="user-info">
            <div className="user-name">{reporterName}</div>
            <div className="user-address">{addressDisplay}</div>
          </div>
          {isUrgent && <span className="urgent-badge">Urgent</span>}
        </div>
        <hr />
        <div className="maintenance-details-message">
          <p>{description}</p>
          <p>
            <strong>Estimated cost:</strong> ₹{cost}
          </p>
        </div>

        <div className="maintenance-details-images-label">Images</div>
        <div className="maintenance-details-images">
          <ImagePreview images={images} />
        </div>

        <div className="maintenance-details-response-row">
          <div>
            <div className="maintenance-details-response-label">
              landlord response
            </div>
            <div className="maintenance-details-response-badge">
              {statusLabel}
            </div>
          </div>
          <button className="send-reminder-btn">Send Reminder</button>
        </div>
      </div>
      <div className="maintenance-details-actions-row">
        <button className="send-btn">Send Message</button>
        <Link to="/provider">
          <button className="assign-btn">Assign Provider</button>
        </Link>
        <button className="resolve-btn">Resolve</button>
        <button className="archive-btn" disabled>
          Archive
        </button>
      </div>
    </div>
  );
}

export default MaintenanceDetails;
