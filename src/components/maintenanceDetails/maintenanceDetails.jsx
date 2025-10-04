import React from 'react';
import './maintenanceDetails.scss';

function MaintenanceDetails() {
  return (
    <div className="maintenance-details-page">
      <h1>Maintenance Details</h1>
      <p className="subtitle">Manage Your Task and Activities.</p>
      <div className="maintenance-details-card">
        <div className="maintenance-details-header">
          <img src="/assets/3d_avatar_1.png" alt="avatar" className="avatar" />
          <div className="user-info">
            <div className="user-name">Anjali Kapoor</div>
            <div className="user-address">4517 Washington Ave.<br />Manchester, Kentucky 39495</div>
          </div>
          <span className="urgent-badge">Urgent</span>
        </div>
        <hr />
        <div className="maintenance-details-message">
          <p>Hi,</p>
          <p>
            I need Help to Process The Payment through UPI.<br />
            Its returning failed payment after the checkout. I need to send out this campaign whin today. can you please help ASAP.<br />
            Thanks
          </p>
        </div>
        <div className="maintenance-details-images-label">Images</div>
        <div className="maintenance-details-images">
          <div className="img-placeholder"></div>
          <div className="img-placeholder"></div>
          <div className="img-placeholder"></div>
        </div>
        <div className="maintenance-details-response-row">
          <div>
            <div className="maintenance-details-response-label">landlord response</div>
            <div className="maintenance-details-response-badge">Approved</div>
          </div>
          <button className="send-reminder-btn">Send Reminder</button>
        </div>
      </div>
      <div className="maintenance-details-actions-row">
        <button className="send-btn">Send Message</button>
        <button className="assign-btn">Assign Provider</button>
        <button className="resolve-btn">Resolve</button>
        <button className="archive-btn" disabled>Archive</button>
      </div>
    </div>
  );
}

export default MaintenanceDetails;