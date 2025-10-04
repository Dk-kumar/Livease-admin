import React, { useState } from 'react';
import './creditwallet.scss';

function CreditWallet() {
  const [form, setForm] = useState({
    amount: '',
    landlord: '',
    reason: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="creditwallet-page">
      <div className="creditwallet-card">
        <h1>Credit Wallet</h1>
        <p className="creditwallet-desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </p>
        <div className="creditwallet-form-row">
          <div className="creditwallet-form-group">
            <label>Enter Amount*</label>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
            />
          </div>
          <div className="creditwallet-form-group">
            <label>Landlord Name</label>
            <input
              type="text"
              name="landlord"
              placeholder="Search"
              value={form.landlord}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="creditwallet-form-group">
          <label>Reason for balance update*</label>
          <textarea
            name="reason"
            placeholder="e.g., Sync with payment gateway"
            value={form.reason}
            onChange={handleChange}
            rows={3}
          />
        </div>
        <div className="creditwallet-actions">
          <button className="submit-btn">Submit</button>
          <button className="cancel-btn" type="button">Cancel</button>
          <button className="receipt-btn" type="button">Generate Receipt</button>
        </div>
      </div>
    </div>
  );
}

export default CreditWallet;