import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyCheckupById, approvePropertyCheckup, rejectPropertyCheckup } from "../../server";
import ImagePreview from "../comman/ImagePreview/ImagePreview";
import "./PropertyCheckupDetails.scss";

function PropertyCheckupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkupDetails, setCheckupDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCheckupDetails = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError("Missing checkup ID in URL");
          setLoading(false);
          return;
        }

        const data = await getPropertyCheckupById(id);
        console.log('Checkup details response:', data);
        // Handle different response structures
        const checkupData = data?.checkup || data?.data || data;
        setCheckupDetails(checkupData || null);
      } catch (err) {
        console.error("Failed to fetch property checkup", err);
        setError("Failed to fetch checkup details");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckupDetails();
  }, [id]);

  const handleApprove = async () => {
    if (!checkupDetails?._id) return;
    
    try {
      setSubmitting(true);
      await approvePropertyCheckup(checkupDetails._id);
      alert('Checkup approved successfully!');
      // Refresh the details
      const data = await getPropertyCheckupById(id);
      const checkupData = data?.checkup || data?.data || data;
      setCheckupDetails(checkupData || null);
    } catch (error) {
      console.error('Error approving checkup:', error);
      alert('Failed to approve checkup. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!checkupDetails?._id) return;
    
    const comments = prompt('Please provide a reason for rejection:');
    if (!comments || comments.trim() === '') return; // User cancelled or empty
    
    try {
      setSubmitting(true);
      await rejectPropertyCheckup(checkupDetails._id, { comments: comments.trim() });
      alert('Checkup rejected successfully!');
      // Refresh the details
      const data = await getPropertyCheckupById(id);
      const checkupData = data?.checkup || data?.data || data;
      setCheckupDetails(checkupData || null);
    } catch (error) {
      console.error('Error rejecting checkup:', error);
      alert('Failed to reject checkup. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="property-checkup-details-page">
        <h1>Property Checkup Details</h1>
        <p className="subtitle">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-checkup-details-page">
        <h1>Property Checkup Details</h1>
        <p className="subtitle">{error}</p>
        <button onClick={() => navigate('/property-checkups')} className="back-btn">
          ← Back to Checkups
        </button>
      </div>
    );
  }

  if (!checkupDetails) {
    return (
      <div className="property-checkup-details-page">
        <h1>Property Checkup Details</h1>
        <p className="subtitle">No checkup found.</p>
        <button onClick={() => navigate('/property-checkups')} className="back-btn">
          ← Back to Checkups
        </button>
      </div>
    );
  }

  // Extract data
  const landlord = checkupDetails.landlord || {};
  const tenant = checkupDetails.tenant || {};
  const property = checkupDetails.property || {};
  const landlordName = landlord.name || "Unknown Landlord";
  const tenantName = tenant.name || "Unknown Tenant";
  const propertyTitle = property.title || property.address || "Unknown Property";
  const status = checkupDetails.status || "Pending";
  const requestDate = checkupDetails.request_date 
    ? new Date(checkupDetails.request_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : "—";
  const scheduledDate = checkupDetails.scheduled_date 
    ? new Date(checkupDetails.scheduled_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : "—";
  
  // Get tenant pictures (organized by room)
  const tenantPictures = checkupDetails.tenant_pictures || {};
  const rooms = [
    { key: 'livingRoom', label: 'Living Room' },
    { key: 'masterBedroom', label: 'Master Bedroom' },
    { key: 'guestBedroom', label: 'Guest Bedroom' },
    { key: 'masterBathroom', label: 'Master Bathroom' },
    { key: 'kitchen', label: 'Kitchen' }
  ];

  const canApprove = status === 'Submitted' || status === 'Pending';
  const canReject = status === 'Submitted' || status === 'Pending';

  return (
    <div className="property-checkup-details-page">
      <div className="property-checkup-details-header">
        <button onClick={() => navigate('/property-checkups')} className="back-btn">
          ← Back to Checkups
        </button>
        <div>
          <h1>Property Checkup Details</h1>
          <p className="subtitle">Request ID: {checkupDetails._id}</p>
        </div>
      </div>

      <div className="property-checkup-details-card">
        {/* Basic Information */}
        <div className="info-section">
          <h2>Basic Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Landlord</label>
              <div className="info-value">{landlordName}</div>
            </div>
            <div className="info-item">
              <label>Tenant</label>
              <div className="info-value">{tenantName}</div>
            </div>
            <div className="info-item">
              <label>Property</label>
              <div className="info-value">{propertyTitle}</div>
            </div>
            <div className="info-item">
              <label>Request Date</label>
              <div className="info-value">{requestDate}</div>
            </div>
            <div className="info-item">
              <label>Scheduled Date</label>
              <div className="info-value">{scheduledDate}</div>
            </div>
            <div className="info-item">
              <label>Status</label>
              <div className="info-value">
                <span className={`status-badge status-${status.toLowerCase()}`}>
                  {status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Pictures by Room */}
        {Object.keys(tenantPictures).length > 0 && (
          <div className="pictures-section">
            <h2>Property Pictures</h2>
            {rooms.map((room) => {
              const roomPictures = tenantPictures[room.key] || [];
              if (roomPictures.length === 0) return null;
              
              return (
                <div key={room.key} className="room-pictures">
                  <h3>{room.label}</h3>
                  <div className="pictures-grid">
                    <ImagePreview images={roomPictures} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Landlord Comments (if rejected) */}
        {checkupDetails.landlord_comments && (
          <div className="comments-section">
            <h2>Landlord Comments</h2>
            <p className="comments-text">{checkupDetails.landlord_comments}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="actions-section">
          {(canApprove || canReject) && (
            <div className="action-buttons">
              {canApprove && (
                <button 
                  onClick={handleApprove} 
                  className="approve-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : '✓ Approve Checkup'}
                </button>
              )}
              {canReject && (
                <button 
                  onClick={handleReject} 
                  className="reject-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : '✗ Reject Checkup'}
                </button>
              )}
            </div>
          )}
          {status === 'Approved' && (
            <div className="status-message">
              <p>✓ This checkup has been approved.</p>
            </div>
          )}
          {status === 'Rejected' && (
            <div className="status-message">
              <p>✗ This checkup has been rejected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyCheckupDetails;

