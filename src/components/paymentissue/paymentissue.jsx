import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById, updateTicket } from '../../server/index';
import './paymentissue.scss';

function PaymentIssue() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState([]);
  const [hasSent, setHasSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await getTicketById(ticketId);
      // Backend returns ticket directly, not wrapped
      const ticketData = response?.ticket || response;
      if (ticketData) {
        setTicket(ticketData);
        
        // Format ticket data into messages
        // Note: The backend doesn't have a messages/replies field yet
        // So we'll show the ticket details as the initial message
        const userName = ticketData.user?.name || 
                        (typeof ticketData.user === 'object' ? ticketData.user?.name : 'User') ||
                        'User';
        
        const userMessage = {
          id: 1,
          user: userName,
          avatar: '/assets/3d_avatar_1.png',
          date: ticketData.createdAt 
            ? new Date(ticketData.createdAt).toLocaleString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true, 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })
            : 'Unknown date',
          content: (
            <>
              <p>Category: {ticketData.category || 'Payment Issue'}</p>
              <p>Status: {ticketData.status || 'Active'}</p>
              {ticketData.description && <p>{ticketData.description}</p>}
            </>
          ),
          type: 'user',
          attachments: ticketData.property_images?.map((img, idx) => ({
            name: `image_${idx + 1}.jpg`,
            size: 'Unknown',
            icon: '/assets/Vector (2).png',
            url: img
          })) || []
        };
        setMessages([userMessage]);
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
      setError('Failed to load ticket details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!reply.trim()) return;
    
    // Note: Reply API endpoint doesn't exist yet in backend
    // For now, we'll just add it to local state
    // TODO: Implement POST /api/v1/admin/ticket/:ticket_id/reply when backend is ready
    const newMessage = {
      id: Date.now(),
      user: 'LiveEase Support',
      avatar: '/assets/3d_avatar_1.png',
      date: new Date().toLocaleString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true, 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),
      content: (
        <>
          <p>{reply}</p>
        </>
      ),
      type: 'support',
    };
    
    setMessages([...messages, newMessage]);
    setReply('');
    setHasSent(true);
    
    // TODO: Call reply API when available
    // try {
    //   await replyToTicket(ticketId, reply);
    // } catch (error) {
    //   console.error('Error sending reply:', error);
    // }
  };

  const handleResolve = async () => {
    try {
      setSubmitting(true);
      await updateTicket(ticketId, { status: 'resolved' });
      setTicket(prev => prev ? { ...prev, status: 'resolved' } : null);
      alert('Ticket resolved successfully!');
      // Optionally navigate back to tickets list
      // navigate('/support-ticket');
    } catch (error) {
      console.error('Error resolving ticket:', error);
      alert('Failed to resolve ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async () => {
    try {
      setSubmitting(true);
      await updateTicket(ticketId, { status: 'inactive' });
      setTicket(prev => prev ? { ...prev, status: 'inactive' } : null);
      alert('Ticket archived successfully!');
      navigate('/support-ticket');
    } catch (error) {
      console.error('Error archiving ticket:', error);
      alert('Failed to archive ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="payment-issue-page">
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading ticket details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-issue-page">
        <div style={{ padding: '20px', color: 'red' }}>{error}</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="payment-issue-page">
        <div style={{ padding: '20px', textAlign: 'center' }}>Ticket not found</div>
      </div>
    );
  }

  return (
    <div className="payment-issue-page">
      <div className="payment-issue-main">
        <div className="payment-issue-card">
          <div className="payment-issue-header-row">
            <h2>{ticket.category || 'Payment Issue'}</h2>
            <span className="payment-issue-ticketno">#{ticketId}</span>
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
                <span>Reply to: {ticket.user?.name || (typeof ticket.user === 'object' ? ticket.user?.name : 'User') || 'User'}</span>
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
            <button 
              className="send-btn" 
              onClick={handleSend}
              disabled={submitting || !reply.trim()}
            >
              Send Message
            </button>
            <button 
              className="resolve-btn" 
              onClick={handleResolve}
              disabled={submitting || ticket.status === 'resolved'}
            >
              {ticket.status === 'resolved' ? 'Resolved' : 'Resolve'}
            </button>
            <button 
              className="archive-btn" 
              onClick={handleArchive}
              disabled={submitting || ticket.status === 'inactive'}
            >
              {ticket.status === 'inactive' ? 'Archived' : 'Archive'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentIssue;
