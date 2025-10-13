import React, { useRef, useState } from "react";
import { addProperty } from "../../server";
import "./uploadproperty.scss";

const fieldConfig = [
  {
    label: "Landlord Name",
    name: "landlord",
    type: "text",
    placeholder: "Enter Landlord Name",
  },
  {
    label: "BHK",
    name: "bhk_type",
    type: "select",
    options: ["4 _ BHK", "3 _ BHK", "2 _ BHK"],
  },
  {
    label: "Tenant Name",
    name: "tenant",
    type: "text",
    placeholder: "Enter Tenant Name",
  },
  {
    label: "Rent",
    name: "rent_amount",
    type: "text",
    placeholder: "Enter Rent Amount",
  },
  {
    label: "Amenities",
    name: "amenities",
    type: "text",
    placeholder: "Enter Amenities",
  },
  {
    label: "Deposit",
    name: "deposit",
    type: "text",
    placeholder: "Enter Deposit Amount",
  },
  {
    label: "Address",
    name: "location",
    type: "text",
    placeholder: "e.g., 123, 5th Main, Koramangala, Bangalore",
  },
  {
    label: "Available From",
    name: "possession_date",
    type: "text",
    placeholder: "DD/MM/YY",
  },
];

function UploadProperty() {
  const [form, setForm] = useState({
    landlord: "",
    bhk_type: "",
    tenant: "",
    rent_amount: "",
    amenities: "",
    deposit: "",
    location: "",
    possession_date: "",
    title: "",
    about: "",
    furnishing: "Fully Furnished",
    preferred_tenants: "",
  });

  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);

  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUploadClick = () => {
    imageInputRef.current.click();
  };

  const handleDocumentUploadClick = () => {
    documentInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      property_requirement: form.about || "",
      area: 0,
      bhk_type: [form.bhk_type],
      locality_details: {
        metro_station: false,
        airport: false,
        school: false,
        shopping_mall: false,
        hospital: false,
        place_of_worship: false,
        park: false,
      },
      amenities: {
        pool: false,
        gym: false,
        parking: false,
        lift: false,
        power_backup: false,
        garden: false,
        kids_play_area: false,
        security: false,
      },
      furnishing: form.furnishing,
      preferred_tenants: form.preferred_tenants,
      rental_budget: { min: 0, max: 0 },
      rent_amount: form.rent_amount,
      deposit: form.deposit,
      possession_date: form.possession_date,
      lease_duration: "",
      verification_document: "",
      property_type: "PG",
      property_images: images, // pass uploaded images
      title: form.title,
      location: form.location,
      about: form.about,
      landlord: form.landlord,
      property_documents: documents, // pass uploaded docs
    };

    try {
      await addProperty(payload);
      alert("Property added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add property");
    }
  };

  return (
    <div className="upload-property-page">
      <h1>Add New Property</h1>
      <p className="subtitle">Manage Your Task and Activities.</p>
      <form className="upload-property-form" onSubmit={handleSubmit}>
        <div className="form-fields-grid">
          {fieldConfig.map((field, idx) => (
            <div className="form-group" key={idx}>
              <label>{field.label}</label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {field.options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Images Upload</label>
            <div className="upload-box" onClick={handleImageUploadClick}>
              <span className="upload-text">Drag-and-drop or browse</span>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              ref={imageInputRef}
              onChange={handleImageChange}
            />
            <div className="upload-hint">
              max 3 images, supported formats: JPEG, PNG, max 5MB each
            </div>
          </div>

          <div className="form-group">
            <label>Document Upload</label>
            <div className="upload-box" onClick={handleDocumentUploadClick}>
              <span className="upload-text">Drag-and-drop or browse</span>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.jpeg,.jpg,.png"
              style={{ display: "none" }}
              ref={documentInputRef}
              onChange={handleDocumentChange}
            />
            <div className="upload-hint">
              max 3 files, supported formats: PDF, JPEG, PNG, max 5MB each
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save
          </button>
          <button type="button" className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadProperty;
