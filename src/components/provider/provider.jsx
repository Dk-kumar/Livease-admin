import React, { useState } from 'react';
import './provider.scss';

function Provider() {
  const [form, setForm] = useState({
    providerName: 'Anil\'s Repairs',
    serviceType: 'Electrical',
    phone: '+91-987-654-3210',
    serviceId: '34562781',
    property: '4-BHK Villa',
    scheduling: '',
    time: '00:00 AM',
    note: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="assign-provider-page">
      <div className="assign-provider-card">
        <h1>Assign Provider</h1>
        <p className="subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </p>
        <form className="assign-provider-form">
          <div className="form-row">
            <div className="form-group">
              <label>Enter provider name</label>
              <input
                type="text"
                name="providerName"
                value={form.providerName}
                onChange={handleChange}
                placeholder="Provider Name"
              />
            </div>
            <div className="form-group">
              <label>Service Type</label>
              <select
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
              >
                <option>Electrical</option>
                <option>Plumbing</option>
                <option>Cleaning</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </div>
            <div className="form-group">
              <label>Service ID</label>
              <input
                type="text"
                name="serviceId"
                value={form.serviceId}
                onChange={handleChange}
                placeholder="Service ID"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Property Search</label>
              <select
                name="property"
                value={form.property}
                onChange={handleChange}
              >
                <option>4-BHK Villa</option>
                <option>3-BHK Apartment</option>
                <option>2-BHK Flat</option>
              </select>
            </div>
          </div>
          <h2 className="scheduling-title">Scheduling</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Scheduling</label>
              <div className="input-icon">
                <input
                  type="text"
                  name="scheduling"
                  value={form.scheduling}
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                />
                <span className="icon-calendar">
                  <img src="/assets/calendar_icon.png" alt="calendar" />
                </span>
              </div>
            </div>
            <div className="form-group">
              <label>Time</label>
              <div className="input-icon">
                <input
                  type="text"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  placeholder="00:00 AM"
                />
                <span className="icon-calendar">
                  <img src="/assets/calendar_icon.png" alt="calendar" />
                </span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>
              Additional instructions or phone contact note <span className="optional">(Optional)</span>
            </label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="e.g., Additional instructions or phone contact note"
            />
          </div>
          <div className="assign-provider-actions">
            <button type="submit" className="assign-btn">Assign</button>
            <button type="button" className="cancel-btn">Cancel</button>
            <button type="button" className="send-comm-btn">Send Communication</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Provider;