import React, { useState } from "react";
import "./markComplete.scss";

function MarkComplete() {
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Completion Data:", { note });
    alert("Marked as Complete!");
  };

  return (
    <div className="mark-complete">
      <h2 className="mark-complete__title">Mark Complete</h2>
      <p className="mark-complete__subtitle">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
      </p>

      <form className="mark-complete__form" onSubmit={handleSubmit}>
        {/* Frequency, Due Date, Tenant Status */}
        <div className="mark-complete__details">
          <div className="detail">
            <span className="label">frequency</span>
            <span className="value">Monthly</span>
          </div>
          <div className="detail">
            <span className="label">due date</span>
            <span className="value">07/01/2025</span>
          </div>
          <div className="detail">
            <span className="label">tenant compliance status</span>
            <span className="value">Images Uploaded</span>
          </div>
        </div>

        {/* Notes */}
        <div className="mark-complete__field">
          <label>Note</label>
          <textarea
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add notes on check-up completion"
            maxLength={500}
          ></textarea>
          <small className="char-limit">max 500 characters</small>
        </div>

        {/* Buttons */}
        <div className="mark-complete__actions">
          <button type="submit" className="btn btn--primary">Complete</button>
          <button type="button" className="btn btn--secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default MarkComplete;
