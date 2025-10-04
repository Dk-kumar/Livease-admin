import React, { useState } from "react";
import "./flat.scss";

function Flat() {
  const [amenities] = useState([
    "Hospital",
    "Shopping Mall",
    "Petrol Pump",
    "Garden",
    "Gym",
    "Temple",
  ]);
  const [owner] = useState({
    name: "Manish Patel",
    role: "Landlord",
    avatar: "/assets/3d_avatar_1.png",
  });
  const [documents] = useState([1, 2, 3, 4]);

  return (
    <div className="flat-page">
      <div className="flat-page__section-one rad">
        <div className="flat-header">
          <div>
            <h2>4–BHK, Sea Link view Luxury Flat</h2>
          </div>
          <div className="flat-header__rent">
            <span>
              Monthly Rent : <b>₹ 25000</b>
            </span>
            <span style={{ marginLeft: 24 }}>
              Deposit : <b>₹1,50,000</b>
            </span>
          </div>
        </div>
        <div className="flat-image-section">
          <div className="flat-image-placeholder"></div>
          <div className="flat-actions">
            <button className="flat-share-btn">Share</button>
            <div className="flat-actions-menu">
              <button>Edit Property</button>
              <button>Suspend</button>
              <button>Delete Profile</button>
            </div>
          </div>
        </div>
      </div>
      <div className="flat-bottom-row">
        <div className="flat-desc-card">
          <h3>Description & Overview</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit, sed do eiusmod tempor......
            <span className="flat-view-more">View More</span>
          </p>
        </div>
        <div className="flat-owner-card">
          <h3>Owner & Documents</h3>
          <div className="flat-owner-info">
            <img src={owner.avatar} alt="owner" className="flat-owner-avatar" />
            <div>
              <div className="flat-owner-name">{owner.name}</div>
              <div className="flat-owner-role">{owner.role}</div>
            </div>
            <div className="flat-owner-chat">
              <img src="/assets/Frame 337.png" alt="chat" />
            </div>
          </div>
          <div className="flat-documents-label">Documents</div>
          <div className="flat-documents">
            {documents.map((doc, idx) => (
              <div key={idx} className="flat-document-placeholder"></div>
            ))}
          </div>
        </div>
        <div className="flat-amenities-card">
          <h3>Amenities</h3>
          <div className="flat-amenities-list">
            {amenities.map((item, idx) => (
              <span key={idx} className="flat-amenity">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flat;
