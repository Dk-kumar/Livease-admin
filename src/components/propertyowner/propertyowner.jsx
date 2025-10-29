import React, { useState, useRef, useEffect } from "react";
import "./propertyowner.scss";
import { getProfileDetails, getPropertyByUserID } from "../../server";
import { Link, useParams } from "react-router-dom";

function PropertyOwner() {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

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

  const [listedProperties, setListedProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [propertiesError, setPropertiesError] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch profile details
  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getProfileDetails(id);
        if (!mounted) return;
        if (res) {
          // Map API fields to the expected owner shape
          setOwner(res);
        } else {
          setError("No profile data returned");
        }
      } catch (err) {
        console.error("getProfileDetails failed", err);
        setError(err?.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id) fetchProfile();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Fetch properties for this user id
  useEffect(() => {
    let mounted = true;
    const fetchProperties = async () => {
      try {
        setPropertiesLoading(true);
        setPropertiesError(null);
        const res = await getPropertyByUserID(id);
        if (!mounted) return;
        if (Array.isArray(res)) {
          setListedProperties(res);
        } else {
          setListedProperties([]);
          setPropertiesError("No properties found");
        }
      } catch (err) {
        console.error("getPropertyByUserID failed", err);
        setPropertiesError(err?.message || "Failed to load properties");
        setListedProperties([]);
      } finally {
        if (mounted) setPropertiesLoading(false);
      }
    };

    if (id) fetchProperties();
    return () => {
      mounted = false;
    };
  }, [id]);

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

  if (loading) {
    return (
      <div className="property-owner-page">
        <div className="owner-loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-owner-page">
        <div className="owner-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="property-owner-page">
      {/* Top Section */}
      <div className="owner-header">
        <div className="owner-header__img-bg"></div>
        <div className="owner-header__avatar"></div>
        <div className="owner-header__info">
          <div className="owner-header__avatar-img">
            <img src={owner?.profile_pic} alt="owner" />
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
                <span>{owner.number}</span>
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
          {owner?.about}
          {/* <span className="view-more">View More</span> */}
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
          {listedProperties.map((prop) => (
            <div key={prop._id} className="owner-property-card">
              {prop.property_images[0] ? (
                <img
                  src={prop.property_images[0]}
                  alt={prop.property_title || "property"}
                  className="owner-property-img"
                />
              ) : (
                <div
                  className="owner-property-img owner-property-img--placeholder"
                  aria-hidden="true"
                ></div>
              )}
              <div className="owner-property-title">{prop.property_title}</div>
              <div className="owner-property-location">
                {prop.address.country}
              </div>
              <div className="owner-property-rent">
                Rent : {prop.rent_amount.toLocaleString()}/Month
              </div>
              <Link className="owner-property-link" to={`/property/${prop._id}`}>
                <button className="owner-property-btn">View Property</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PropertyOwner;
