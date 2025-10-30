import { useState, useEffect } from "react";
import RangeSlider from "react-range-slider-input";
import { useNavigate, useLocation } from "react-router-dom";
import { addProperty, getPropertyByID } from "../../server";
import {
  prepareProfilePayload,
  mapAiResponseToFormData,
  isSaveFormValid,
  validateMoneyInput,
  validateDurationInput,
} from "../../util/validateForm/";

// import Loader from "../../Components/Loader/Loader.component";
import {
  AiSendIcon,
  backBtnIcon,
  uploadIcon,
  signinLocation,
} from "../../util/svg";
import {
  BHK_OPTIONS,
  LOCALITY_DETAILS_OPTIONS,
  AMENITIES_OPTIONS,
  FURNISHING_OPTIONS,
  PREFERENCE_OPTIONS,
  PROPERTY_TYPE,
} from "../../constants";

import AutoComplete from "../comman/AutoComplete/AutoComplete";
import "react-range-slider-input/dist/style.css";
import "./addProperty.scss";

/* ---------- Small Components ---------- */
const CheckboxGroup = ({
  field,
  options,
  selected,
  onToggle,
  inputType = "checkbox",
}) => (
  <div className="checkbox-group">
    {options.map((item) => (
      <label key={item}>
        <input
          type={inputType}
          checked={selected.includes(item)}
          onChange={() => onToggle(field, item)}
        />
        {item}
      </label>
    ))}
  </div>
);

const BooleanCheckboxGroup = ({ field, options, selected, onToggle }) => (
  <div className="checkbox-group">
    {options.map((item) => (
      <label key={item.key}>
        <input
          type="checkbox"
          checked={selected[item.key] || false}
          onChange={() => onToggle(field, item.key)}
        />
        {item.label}
      </label>
    ))}
  </div>
);

const InputGroup = ({ label, children, required }) => (
  <div className="section">
    <label className="label">
      {label} {required && <span className="required">*</span>}
    </label>
    {children}
  </div>
);

const FileUpload = ({ accountType, onUpload, uploaded }) => (
  <InputGroup label="Verification" required>
    <input
      type="file"
      id="document-upload"
      style={{ display: "none" }}
      onChange={(e) => onUpload(e.target.files[0])}
    />
    <label htmlFor="document-upload" className="upload-btn">
      {accountType === "landlord"
        ? "Upload Property Bill/Document"
        : "Upload ID Proof"}{" "}
      <i>{uploadIcon()}</i>
    </label>
    {uploaded && (
      <p className="document-status">Document uploaded successfully</p>
    )}
  </InputGroup>
);

/* ---------- Main Component ---------- */
const DetailsComponent = () => {
const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const userId = queryParams.get("userId");
  const type = queryParams.get("type");
  const action = queryParams.get("action") || '';

  // Minimal local user state to preserve tenant vs landlord UI branching.
  const [user] = useState(() => {
    // normalize incoming type query param to match utils expectations ("Landlord"/"Tenant")
    const normalized = type
      ? type.toLowerCase() === "landlord"
        ? "landlord"
        : "tenant"
      : localStorage.getItem("account_type") || "tenant";
    return { account_type: normalized };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const navigate = useNavigate();

  // Local UI-only form state. No API calls or validations here.
  const [formData, setFormData] = useState({
    property_requirement: "",
    property_images: [],
    property_name: "",
    address: {},
    about: "",
    space: { min: 0, max: 100 },
    bhk_type: [],
    locality_details: {},
    amenities: {},
    furnishing: "",
    rental_budget: { min: "", max: "" },
    deposit: { min: "", max: "" },
    preference: "",
    possession_date: "",
    lease_duration: "",
    verification_document: null,
    aiSuggestion: [],
    property_type: "",
    is_primary: false,
  });

  /* ---------- Simple UI handlers (no side-effects) ---------- */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parent, child, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [child]: value },
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => {
      if (field === "bhk_type") {
        return {
          ...prev,
          bhk_type: prev.bhk_type.includes(value)
            ? prev.bhk_type.filter((v) => v !== value)
            : [...prev.bhk_type, value],
        };
      }
      return {
        ...prev,
        [field]: { ...prev[field], [value]: !prev[field]?.[value] },
      };
    });
  };

  const handlePropertyImagesUpload = (files) => {
    // UI-only: create object URLs so previews work in the browser during development.
    const arr = Array.from(files || []).map((f) => URL.createObjectURL(f));
    setFormData((prev) => ({
      ...prev,
      property_images: [...prev.property_images, ...arr],
    }));
  };

  const toggleAiSuggestion = (enabled) =>
    setFormData((prev) => ({
      ...prev,
      aiSuggestion: enabled ? ["enabled"] : [],
    }));

  const handleAiRequirement = () => {
    // UI-only placeholder: mark AI as used and do not call external services.
    setFormData((prev) => ({ ...prev, aiSuggestion: ["enabled"] }));
  };

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };
  const handleSave = async () => {
    // Call the API to add property. Show basic success / failure feedback and
    // navigate back to profile/dashboard on success.
    try {
      setIsLoading(true);
      // Build payload using shared prepareProfilePayload helper so field names
      // and types match server expectations.
      const accountTypeForPayload =
        user.account_type && user.account_type.toLowerCase() === "landlord"
          ? "landlord"
          : "tenant";
      const payload = prepareProfilePayload(formData, accountTypeForPayload);

      // When adding a property for a specific landlord (navigated from profile),
      // include the landlord id so backend can associate the property.
      if (type && type.toLowerCase() === "landlord" && userId) {
        payload.landlord = userId;
      }

      await addProperty(payload);
      // notify user and navigate back to profile (existing back button goes to /profile)
      alert("Property added successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Failed to add property", err);
      alert("Failed to add property. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = (file) => {
    // Store a placeholder/local reference for UI preview.
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, verification_document: url }));
  };

  /* ---------- JSX ---------- */
  return (
    <>
      {/* {isLoading && <Loader />}
      {isLoading && <Loader />} */}

      <div className="edit-profile-setup rad">
        <h2>
          {user.account_type === "landlord"
            ? "Add New Property"
            : "Set up Your Profile"}
        </h2>
        <p className="subtitle">
          {user.account_type !== "landlord"
            ? "Complete your Profile And find Best Property, kindly fill all the field to find best deals."
            : "Complete your Property details And find Best Tenant, kindly fill all the field to find best deals."}
        </p>

        {user.account_type === "landlord" && (
          <>
            <div className="primary-checkbox">
              <label>
                Select as Primary
                <input
                  type="checkbox"
                  checked={formData.is_primary}
                  onChange={(e) =>
                    handleInputChange("is_primary", e.target.checked)
                  }
                />
              </label>
            </div>
            <InputGroup label="Upload Property Images" required>
              <input
                type="file"
                id="property-images-upload"
                style={{ display: "none" }}
                multiple
                className="property-images-upload"
                onChange={(e) => handlePropertyImagesUpload(e.target.files)}
              />
              <label htmlFor="property-images-upload" className="upload-btn">
                Upload <i>{uploadIcon()}</i>
              </label>

              <div className="uploaded-images">
                {formData.property_images.map((img, idx) => (
                  <div key={idx} className="image-preview">
                    <img src={img} alt={`Property ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </InputGroup>

            <InputGroup label="Property Name" required>
              <input
                className="input propertyname-input"
                placeholder="Property Name"
                value={formData.property_name}
                onChange={(e) =>
                  handleInputChange("property_name", e.target.value)
                }
              />
            </InputGroup>

            <InputGroup label="Location" required>
              <AutoComplete
                id="address"
                placeholder="Location"
                value={formData.address?.structured_formatting?.main_text}
                onChange={handleInputChange}
                onBlur={handleBlur}
                // icon={signinLocation}
              />
            </InputGroup>
          </>
        )}

        {/* {user.account_type !== "landlord" && (
          <InputGroup label="Property Requirements">
            <div className="Ai-requirement">
              <textarea
                placeholder="Type your requirement here..."
                className="requirement-input"
                value={formData.property_requirement}
                onChange={(e) =>
                  handleInputChange("property_requirement", e.target.value)
                }
              />
              <i onClick={handleAiRequirement}>{AiSendIcon()}</i>
            </div>
          </InputGroup>
        )} */}

        <InputGroup label="Space">
          <div className="space-slider">
            <RangeSlider
              min={100}
              max={10000}
              step={100}
              className="single-thumb"
              value={[0, formData.space.max || 100]}
              thumbsDisabled={[true, false]}
              rangeSlideDisabled
              onInput={([, max]) =>
                handleNestedInputChange("space", "max", max)
              }
            />
            <input
              className="input"
              placeholder="Sq. Feet"
              value={formData.space.max ? `${formData.space.max} Sq. Feet` : ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                const val = Math.max(100, Math.min(Number(raw), 10000));
                handleNestedInputChange("space", "max", val);
              }}
            />
          </div>
          <CheckboxGroup
            field="bhk_type"
            options={BHK_OPTIONS}
            selected={formData.bhk_type}
            onToggle={handleCheckboxChange}
          />
        </InputGroup>

        <InputGroup label="Locality Details">
          <BooleanCheckboxGroup
            field="locality_details"
            options={LOCALITY_DETAILS_OPTIONS}
            selected={formData.locality_details}
            onToggle={handleCheckboxChange}
          />
        </InputGroup>

        <InputGroup label="Amenities">
          <BooleanCheckboxGroup
            field="amenities"
            options={AMENITIES_OPTIONS}
            selected={formData.amenities}
            onToggle={handleCheckboxChange}
          />
        </InputGroup>

        <InputGroup label="Furnishing">
          <CheckboxGroup
            field="furnishing"
            options={FURNISHING_OPTIONS}
            selected={[formData.furnishing]}
            onToggle={(field, val) =>
              handleInputChange(field, formData.furnishing === val ? "" : val)
            }
          />
        </InputGroup>

        {user.account_type === "landlord" && (
          <>
            <InputGroup label="Preference" required>
              <CheckboxGroup
                field="preference"
                options={PREFERENCE_OPTIONS}
                selected={[formData.preference]}
                onToggle={(field, val) =>
                  handleInputChange(
                    field,
                    formData.preference === val ? "" : val
                  )
                }
              />
            </InputGroup>
            <InputGroup label="Property Type" required>
              <CheckboxGroup
                field="property_type"
                inputType="radio"
                options={PROPERTY_TYPE}
                selected={[formData.property_type]}
                onToggle={(field, val) =>
                  handleInputChange(
                    field,
                    formData.property_type === val ? "" : val
                  )
                }
              />
            </InputGroup>
          </>
        )}

        <InputGroup label="Rental Budget" required>
          {user.account_type === "landlord" ? (
            <div className="suggestion-checkbox">
              <input
                className="input"
                placeholder="Minimum Budget"
                value={formData.rental_budget.min}
                onChange={(e) =>
                  handleNestedInputChange(
                    "rental_budget",
                    "min",
                    e.target.value
                  )
                }
              />
              <div className="ai-suggestion-wrapper">
                <div className="ai-text-wrapper">
                  <span>Get AI pricing suggestions</span>
                  <span className="sub-text">
                    Helps improve the odds of renting out your property
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.aiSuggestion.includes("enabled")}
                  onChange={(e) => toggleAiSuggestion(e.target.checked)}
                />
              </div>
            </div>
          ) : (
            <div className="input-group">
              <input
                className="input"
                placeholder="Minimum Budget"
                value={formData.rental_budget.min}
                onChange={(e) =>
                  handleNestedInputChange(
                    "rental_budget",
                    "min",
                    e.target.value
                  )
                }
              />
              <input
                className="input"
                placeholder="Maximum Budget"
                value={formData.rental_budget.max}
                onChange={(e) =>
                  handleNestedInputChange(
                    "rental_budget",
                    "max",
                    e.target.value
                  )
                }
              />
            </div>
          )}
        </InputGroup>

        <div className="section group-section">
          <div className="inner-section">
            <label className="label">
              Possession Date <span className="required">*</span>
            </label>
            <input
              className="input"
              type="date"
              value={formData.possession_date}
              onChange={(e) =>
                handleInputChange("possession_date", e.target.value)
              }
            />
          </div>
          <div className="inner-section">
            <label className="label">
              Lease Duration <span className="required">*</span>
            </label>
            <input
              className="input"
              placeholder="Lease Duration"
              value={formData.lease_duration}
              onChange={(e) =>
                handleInputChange("lease_duration", e.target.value)
              }
            />
          </div>
        </div>

        <InputGroup label="Deposit" required>
          <div className="input-group">
            <input
              className="input"
              placeholder="Minimum Deposit"
              value={formData.deposit.min}
              onChange={(e) =>
                handleNestedInputChange("deposit", "min", e.target.value)
              }
            />
            {user.account_type !== "landlord" && (
              <input
                className="input"
                placeholder="Maximum Deposit"
                value={formData.deposit.max}
                onChange={(e) =>
                  handleNestedInputChange("deposit", "max", e.target.value)
                }
              />
            )}
          </div>
        </InputGroup>

        {user.account_type === "landlord" && (
          <InputGroup label="About The Property" required>
            <textarea
              className="input"
              placeholder="Type about the property here..."
              value={formData.about}
              onChange={(e) => handleInputChange("about", e.target.value)}
            />
          </InputGroup>
        )}

        <FileUpload
          accountType={user.account_type}
          onUpload={handleDocumentUpload}
          uploaded={formData.verification_document}
        />

        <div className="actions">
          <button className="skip-btn">Skip</button>
          <button
            className="save-btn"
            onClick={handleSave}
            // disabled={!isSaveFormValid(formData, user.account_type)}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default DetailsComponent;
