import React, { useState } from "react";
import "./reminder.scss";

function SendReminder() {
  const [recipient, setRecipient] = useState("Priya Sharma");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [sendPush, setSendPush] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      recipient,
      dueDate,
      message,
      notifications: {
        email: sendEmail,
        push: sendPush,
      },
    };
    console.log("Reminder Data:", formData);
    alert("Reminder Sent!");
  };

  return (
    <div className="reminder">
      <h2 className="reminder__title">Send Reminder</h2>
      <p className="reminder__subtitle">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
      </p>

      <form className="reminder__form" onSubmit={handleSubmit}>
        {/* Recipient */}
        <div className="reminder__field">
          <label>Recipient</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient name"
          />
        </div>

        {/* Due Date */}
        <div className="reminder__field">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Custom Message */}
        <div className="reminder__field">
          <label>Custom Message</label>
          <textarea
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g., Additional instructions or phone contact note"
          ></textarea>
        </div>

        {/* Notifications */}
        <div className="reminder__field">
          <label>Notification</label>
          <div className="reminder__checkboxes">
            <label>
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={() => setSendEmail(!sendEmail)}
              />
              Send Email
            </label>
            <label>
              <input
                type="checkbox"
                checked={sendPush}
                onChange={() => setSendPush(!sendPush)}
              />
              Send Push Notification
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="reminder__actions">
          <button type="submit" className="btn btn--primary">Send</button>
          <button type="button" className="btn btn--secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default SendReminder;
