import React, { useState, useRef, useEffect } from "react";
import "./propertyowner.scss";

function PropertyOwner() {
  const [owner] = useState({
    name: "Manish Patel",
    rating: 4.0,
    location: "Surat, Gujrat",
    phone: "+91 1112233344",
    email: "xyz@gmail.com",
    avatar: "/assets/3d_avatar_1.png",
  });

  const [documents] = useState({
    property: [1, 2, 3],
    landlord: [1, 2, 3],
  });

  const [wallet] = useState({
    balance: 15000,
    history: [
      {
        date: "14 apr",
        name: "Rina Vyas",
        flat: "3BHK Flat",
        amount: "+25,000/-",
        avatar: "/assets/3d_avatar_1.png",
      },
      {
        date: "14 apr",
        name: "Rina Vyas",
        flat: "3BHK Flat",
        amount: "+25,000/-",
        avatar: "/assets/3d_avatar_1.png",
      },
    ],
  });

  const [reviews] = useState([
    {
      name: "Manish Sharma",
      rating: 4.0,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.",
      avatar: "/assets/3d_avatar_1.png",
    },
    {
      name: "Manish Sharma",
      rating: 4.0,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.",
      avatar: "/assets/3d_avatar_1.png",
    },
  ]);

  const [preferences] = useState({
    status: "Bachelor",
    language: "Hindi, Gujrati",
  });

  const [listedProperties] = useState([
    {
      title: "4BHK-Flat",
      location: "Bandra, Mumbai",
      rent: "45,000/Month",
      img: "/assets/Rectangle 33.png",
    },
    {
      title: "4BHK-Flat",
      location: "Bandra, Mumbai",
      rent: "45,000/Month",
      img: "/assets/Rectangle 33.png",
    },
    {
      title: "4BHK-Flat",
      location: "Bandra, Mumbai",
      rent: "45,000/Month",
      img: "/assets/Rectangle 33.png",
    },
    {
      title: "4BHK-Flat",
      location: "Bandra, Mumbai",
      rent: "45,000/Month",
      img: "/assets/Rectangle 33.png",
    },
  ]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="property-owner-page">
      {/* Top Section */}
      <div className="owner-header">
        <div className="owner-header__img-bg"></div>
        <div className="owner-header__avatar"></div>
        <div className="owner-header__info">
          <div className="owner-header__avatar-img">
            <img src={owner.avatar} alt="owner" />
          </div>
          <div>
            <h2>{owner.name}</h2>
            <div className="owner-header__rating">
              <span>★</span> {owner.rating}
            </div>
            <div className="owner-header__contact">
              <div className="owner-header__contact-item">
                <img src="/assets/location_on.png"></img>
                <span>{owner.location}</span>
              </div>
              <div className="owner-header__contact-item">
                <img src="/assets/call_end.png"></img>
                <span>{owner.phone}</span>
              </div>
              <div className="owner-header__contact-item">
                <img src="/assets/mark_email_unread.png"></img>
                <span>{owner.email}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="owner-header__actions">
          <button>Share</button>
          <button
            className="owner-header__dots"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <img
              src="/assets/Frame 608.png"
              alt="More"
              style={{ width: 22, height: 22 }}
            />
          </button>
          {dropdownOpen && (
            <div className="owner-header__dropdown" ref={dropdownRef}>
              <button>Edit Property</button>
              <button>Suspend</button>
              <button>Delete Profile</button>
              <button>Approve</button>
              <button>Reject</button>
              <button>Add Property</button>
            </div>
          )}
        </div>
        <div className="owner-header__desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit, sed do eiusmod tempor......{" "}
          <span className="view-more">View More</span>
        </div>
      </div>

      {/* Middle Section */}
      <div className="owner-middle-row">
        {/* Documents */}
        <div className="doc-preferences">
          <div className="owner-card">
            <h3>Documents</h3>
            <div className="owner-doc-label">Property Document</div>
            <div className="owner-doc-list">
              {documents.property.map((_, idx) => (
                <div key={idx} className="owner-doc-placeholder"></div>
              ))}
            </div>
            <div className="owner-doc-label">Landlord Document</div>
            <div className="owner-doc-list">
              {documents.landlord.map((_, idx) => (
                <div key={idx} className="owner-doc-placeholder"></div>
              ))}
            </div>
          </div>
          {/* Preferences */}
          <div className="owner-preferences-card">
            <h3>Preferences</h3>
            <div className="owner-preferences-row">
              <span>Status</span>
              <span className="owner-preferences-value">
                {preferences.status}
              </span>
            </div>
            <div className="owner-preferences-row">
              <span>Preferred Language</span>
              <span className="owner-preferences-values">
                {preferences.language}
              </span>
            </div>
          </div>
        </div>
        {/* Wallet */}
        <div className="owner-card">
          <h3>Wallet</h3>
          <div className="owner-wallet-balance">
            <span>Your Available Balance is</span>
            <div className="owner-wallet-amount rad">
              <span className="owner-wallet-credits">
                <img src="/assets/cryptocurrency-color_gold.png"></img>
                <span> Credits</span>
              </span>
              <span className="owner-wallet-value">
                {wallet.balance.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="owner-wallet-history-label">Payment History</div>
          <div className="owner-wallet-history">
            <span className="owner-wallet-date">14 apr</span>
            {wallet.history.map((item, idx) => (
              <div key={idx} className="owner-wallet-history-row">
                <img
                  src={item.avatar}
                  alt="avatar"
                  className="owner-wallet-avatar"
                />
                <span className="name-flat">
                  <span className="owner-wallet-name">{item.name}</span>
                  <span className="owner-wallet-flat">{item.flat}</span>
                </span>
                <span className="owner-wallet-amount-pos">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Reviews */}
        <div className="owner-card">
          <h3>Reviews</h3>
          {reviews.map((review, idx) => (
            <div key={idx} className="owner-review">
              <div className="owner-review-text">{review.text}</div>
              <div className="owner-review-user">
                <img
                  src={review.avatar}
                  alt="avatar"
                  className="owner-review-avatar"
                />
                <span className="owner-review-name">{review.name}</span>
                <span className="owner-review-rating">★ {review.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listed Properties */}
      <div className="owner-listed-properties-card">
        <h3>Listed Property</h3>
        <div className="owner-listed-properties-list">
          {listedProperties.map((prop, idx) => (
            <div key={idx} className="owner-property-card">
              <img
                src={prop.img}
                alt="property"
                className="owner-property-img"
              />
              <div className="owner-property-title">{prop.title}</div>
              <div className="owner-property-location">{prop.location}</div>
              <div className="owner-property-rent">Rent : {prop.rent}</div>
              <button className="owner-property-btn">View Property</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PropertyOwner;
