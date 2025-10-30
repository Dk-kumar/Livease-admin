import React, { useState, useRef, useEffect } from "react";
import "./propertyowner.scss";
import {
  getProfileDetails,
  getPropertyByUserID,
  updateUserStatus,
} from "../../server";
import { Link, useParams, useLocation } from "react-router-dom";

function PropertyOwner() {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const location = useLocation();
  // read userType from url query param: ?userType=landlord
  const query = new URLSearchParams(location.search);
  const userTypeFromUrl = query.get("userType");
  const isLandlordView = userTypeFromUrl === "landlord" ? true : false;

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
  const [actionInProgress, setActionInProgress] = useState(false);

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

  // Handler to confirm and perform actions on this owner's profile (and properties if present)
  const handleOwnerAction = async (actionLabel) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabel.toLowerCase()} this profile?`
    );
    if (!confirmed) return;

    // Map label to API payload
    let payloadForUser = null;
    const label = actionLabel.toLowerCase();
    if (label.includes("delete")) {
      payloadForUser = { is_deleted: true };
    } else if (label.includes("suspend") || label.includes("suspended")) {
      payloadForUser = { status: "suspended" };
    } else if (label.includes("approve") || label.includes("approved")) {
      payloadForUser = { status: "approved" };
    } else if (label.includes("reject") || label.includes("rejected")) {
      payloadForUser = { status: "rejected" };
    } else {
      payloadForUser = { status: label };
    }

    try {
      setActionInProgress(true);
      await updateUserStatus(payloadForUser, id);

      alert(`${actionLabel} action applied`);
    } catch (err) {
      console.error("Failed to apply action", err);
      alert(`Failed to ${actionLabel}. Please try again.`);
    } finally {
      setActionInProgress(false);
    }
  };

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
              {/* action buttons - only show for landlord view */}
              {isLandlordView ? (
                <>
                  <button onClick={() => handleOwnerAction("Suspend")}>
                    Suspend
                  </button>
                  <button onClick={() => handleOwnerAction("Delete Profile")}>
                    Delete Profile
                  </button>
                  <button onClick={() => handleOwnerAction("Approve")}>
                    Approve
                  </button>
                  <button onClick={() => handleOwnerAction("Reject")}>
                    Reject
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleOwnerAction("Suspend")}>
                    Suspend
                  </button>
                  <button onClick={() => handleOwnerAction("Delete Profile")}>
                    Delete Profile
                  </button>
                </>
              )}
              <Link to={`/add-property?userId=${id}&type=landlord`}>
                <button>Add Property</button>
              </Link>
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
          {/* <div className="owner-preferences-card">
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
          </div> */}
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
              <Link
                className="owner-property-link"
                to={`/property/${prop._id}`}
              >
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
