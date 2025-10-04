import React, { useState } from 'react';
import './paymentissue.scss';

function PaymentIssue() {
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Anjali Kapoor',
      avatar: '/assets/3d_avatar_1.png',
      date: '11:20 AM IST, May 28, 2025',
      attachments: [
        { name: 'doc.pdf', size: '215 kB', icon: '/assets/Vector (2).png' },
        { name: 'doc.pdf', size: '215 kB', icon: '/assets/Icon (5).png' },
      ],
      content: (
        <>
          <p>Hi,</p>
          <p>
            I need Help to Process The Payment through UPI.<br /><br />
            Its returning failed payment after the checkout. I need to send out this campaign whin today. can you please help ASAP.<br /><br />
            Thanks
          </p>
        </>
      ),
      type: 'user',
    }
  ]);
  const [hasSent, setHasSent] = useState(false);

  const handleSend = () => {
    if (!reply.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        user: 'LiveEase Support',
        avatar: '/assets/3d_avatar_1.png',
        date: new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, day: '2-digit', month: 'short', year: 'numeric' }),
        content: (
          <>
            <p>Hi,</p>
            <p>
              {reply}
            </p>
          </>
        ),
        type: 'support',
      },
    ]);
    setReply('');
    setHasSent(true);
  };

  return (
    <div className="payment-issue-page">
      <div className="payment-issue-main">
        <div className="payment-issue-card">
          <div className="payment-issue-header-row">
            <h2>Payment Issue</h2>
            <span className="payment-issue-ticketno">#32416552</span>
          </div>
          <div className="payment-issue-messages">
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={
                  msg.type === 'support'
                    ? 'payment-issue-message-row support'
                    : 'payment-issue-message-row user'
                }
              >
                <div className="payment-issue-user">
                  <img src={msg.avatar} alt="avatar" />
                  <div>
                    <div className="payment-issue-user-name">{msg.user}</div>
                    <div className="payment-issue-user-date">{msg.date}</div>
                  </div>
                </div>
                <div className="payment-issue-message-content">{msg.content}</div>
                {msg.attachments && (
                  <>
                    <div className="payment-issue-attachments-label">
                      {msg.attachments.length} Attachments
                    </div>
                    <div className="payment-issue-attachments">
                      {msg.attachments.map((att, i) => (
                        <div className="payment-issue-attachment" key={i}>
                          <img src={att.icon} alt="icon" />
                          <span>{att.name}</span>
                          <span className="payment-issue-attachment-size">{att.size}</span>
                          <button className="payment-issue-attachment-download">
                            <img src="/assets/Icon (6).png" alt="download" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {/* Show reply box only if not sent */}
          {!hasSent && (
            <div className="payment-issue-reply-card">
              <div className="payment-issue-reply-header">
                <span>Reply to: Anjali Kapoor</span>
              </div>
              <textarea
                placeholder="e.g., Sync with payment gateway"
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              {/* <div className="payment-issue-reply-actions">
                <div className="payment-issue-reply-icons">
                  <button><img src="/assets/attach_icon.png" alt="attach" /></button>
                  <button><img src="/assets/emoji_icon.png" alt="emoji" /></button>
                </div>
                <button className="payment-issue-send-btn" onClick={handleSend}>Send</button>
              </div> */}
            </div>
          )}
        </div>
        {/* Show action buttons below card after send, else on the right */}
        { (
          <div className="payment-issue-actions-row">
            <button className="send-btn" onClick={handleSend}>Send Message</button>
            <button className="resolve-btn">Resolve</button>
            <button className="archive-btn" disabled>Archive</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentIssue;