import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { addServiceProvider, getServiceProviders, getMaintenanceRequests, getMaintenanceRequestsById } from '../../server/index';
import './provider.scss';

function Provider() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestIdFromUrl = searchParams.get('requestId');
  
  const [form, setForm] = useState({
    providerName: '',
    serviceType: 'Electrical',
    phone: '',
    serviceRequest: requestIdFromUrl || '', // Pre-fill if coming from maintenance service
    property: '',
    scheduling: '',
    time: '',
    note: '',
    cost: 0,
  });
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMaintenanceRequests();
    
    // If requestId is provided in URL, fetch that request's details to pre-fill property
    if (requestIdFromUrl) {
      fetchRequestDetails(requestIdFromUrl);
    }
  }, [requestIdFromUrl]);

  const fetchRequestDetails = async (requestId) => {
    try {
      const response = await getMaintenanceRequestsById(requestId);
      if (response) {
        const requestData = response.request || response;
        // Pre-fill property if available
        if (requestData.property?.title) {
          setForm(prev => ({
            ...prev,
            property: requestData.property.title
          }));
        } else if (requestData.property_search) {
          setForm(prev => ({
            ...prev,
            property: requestData.property_search
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };

  const fetchMaintenanceRequests = async () => {
    try {
      setLoading(true);
      const response = await getMaintenanceRequests(1, 100);
      if (response?.requests) {
        setMaintenanceRequests(response.requests);
      }
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const combineDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    
    // Parse date (DD/MM/YYYY)
    const [day, month, year] = dateStr.split('/');
    if (!day || !month || !year) return null;
    
    // Parse time (HH:MM AM/PM)
    let [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours);
    
    if (period?.toUpperCase() === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period?.toUpperCase() === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    const date = new Date(year, month - 1, day, hour24, parseInt(minutes || 0));
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!form.providerName || form.providerName.trim() === '') {
      setError('Provider name is required.');
      return;
    }

    if (!form.phone || form.phone.trim() === '') {
      setError('Phone number is required.');
      return;
    }

    if (!form.serviceRequest) {
      setError('Please select a service request.');
      return;
    }

    if (!form.property || form.property.trim() === '') {
      setError('Property is required.');
      return;
    }

    if (!form.scheduling || !form.time) {
      setError('Scheduling date and time are required.');
      return;
    }

    const scheduledAt = combineDateTime(form.scheduling, form.time);
    if (!scheduledAt) {
      setError('Invalid date or time format. Please use DD/MM/YYYY and HH:MM AM/PM format.');
      return;
    }

    try {
      setSubmitting(true);
      const providerData = {
        name: form.providerName.trim(),
        service_type: form.serviceType,
        number: form.phone.trim(),
        service_request: form.serviceRequest,
        property_search: form.property.trim(),
        additional_info: form.note?.trim() || '',
        scheduled_at: scheduledAt,
        cost: parseFloat(form.cost) || 0,
      };

      const response = await addServiceProvider(providerData);
      
      if (response) {
        setSuccess('Service provider added successfully!');
        // Reset form after 2 seconds
        setTimeout(() => {
          setForm({
            providerName: '',
            serviceType: 'Electrical',
            phone: '',
            serviceRequest: '',
            property: '',
            scheduling: '',
            time: '',
            note: '',
            cost: 0,
          });
          setSuccess('');
          // Optionally navigate back
          // navigate('/maintenance-service');
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding service provider:', error);
      setError(error.message || 'Failed to add service provider. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/maintenance-service');
  };

  return (
    <div className="assign-provider-page">
      <div className="assign-provider-card">
        <h1>Add Service Provider</h1>
        <p className="subtitle">
          Add a new service provider and assign them to a maintenance request.
        </p>

        {error && (
          <div style={{ 
            padding: '12px', 
            marginBottom: '20px', 
            backgroundColor: '#fee', 
            color: '#c33', 
            borderRadius: '4px',
            border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            padding: '12px', 
            marginBottom: '20px', 
            backgroundColor: '#efe', 
            color: '#3c3', 
            borderRadius: '4px',
            border: '1px solid #cfc'
          }}>
            {success}
          </div>
        )}

        <form className="assign-provider-form" onSubmit={handleSubmit}>
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
              <label>Service Request*</label>
              <select
                name="serviceRequest"
                value={form.serviceRequest}
                onChange={handleChange}
                required
              >
                <option value="">Select Service Request</option>
                {maintenanceRequests.map((request) => (
                  <option key={request._id} value={request._id}>
                    Request #{request._id?.substring(0, 8)} - {request.description || 'No description'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Property Search*</label>
              <input
                type="text"
                name="property"
                value={form.property}
                onChange={handleChange}
                placeholder="Property address or name"
                required
              />
            </div>
            <div className="form-group">
              <label>Cost (₹)</label>
              <input
                type="number"
                name="cost"
                value={form.cost}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
              />
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
                  required
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
                  placeholder="HH:MM AM/PM (e.g., 02:30 PM)"
                  required
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
            <button 
              type="submit" 
              className="assign-btn"
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Provider'}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="send-comm-btn"
              disabled={submitting}
            >
              Send Communication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Provider;
