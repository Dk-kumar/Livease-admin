import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTransaction, getUsersList } from '../../server/index';
import './creditwallet.scss';

function CreditWallet() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		amount: '',
		landlord: '',
		landlordId: '',
		reason: '',
		type: 'credit' // 'credit' or 'debit'
	});
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [landlords, setLandlords] = useState([]);
	const [filteredLandlords, setFilteredLandlords] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const searchTimeoutRef = useRef(null);
	const suggestionsRef = useRef(null);

	useEffect(() => {
		// Load initial landlords list
		fetchLandlords('');

		// Handle click outside to close suggestions
		const handleClickOutside = event => {
			if (
				suggestionsRef.current &&
				!suggestionsRef.current.contains(event.target)
			) {
				setShowSuggestions(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const fetchLandlords = async (searchTerm = '') => {
		try {
			setLoading(true);
			const response = await getUsersList(1, 100, 'Landlord');
			if (response?.users) {
				setLandlords(response.users);
				filterLandlords(response.users, searchTerm);
			}
		} catch (error) {
			console.error('Error fetching landlords:', error);
			setError('Failed to load landlords. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const filterLandlords = (landlordList, searchTerm) => {
		if (!searchTerm) {
			setFilteredLandlords(landlordList.slice(0, 10)); // Show first 10
		} else {
			const filtered = landlordList.filter(
				landlord =>
					landlord.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					landlord.email?.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredLandlords(filtered.slice(0, 10));
		}
	};

	const handleChange = e => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
		setError('');
		setSuccess('');

		if (name === 'landlord') {
			// Debounce search
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
			searchTimeoutRef.current = setTimeout(() => {
				filterLandlords(landlords, value);
				setShowSuggestions(true);
			}, 300);
		}
	};

	const handleLandlordSelect = landlord => {
		setForm({
			...form,
			landlord: landlord.name,
			landlordId: landlord._id
		});
		setShowSuggestions(false);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setError('');
		setSuccess('');

		// Validation
		if (!form.amount || parseFloat(form.amount) <= 0) {
			setError('Please enter a valid amount.');
			return;
		}

		if (!form.landlordId) {
			setError('Please select a landlord.');
			return;
		}

		if (!form.reason || form.reason.trim() === '') {
			setError('Please provide a reason for the transaction.');
			return;
		}

		try {
			setSubmitting(true);
			const transactionData = {
				user_id: form.landlordId,
				amount: parseFloat(form.amount),
				type: form.type,
				description: form.reason.trim()
			};

			const response = await createTransaction(transactionData);

			if (response) {
				setSuccess(
					`Wallet ${
						form.type === 'credit' ? 'credited' : 'debited'
					} successfully!`
				);
				// Reset form after 2 seconds
				setTimeout(() => {
					setForm({
						amount: '',
						landlord: '',
						landlordId: '',
						reason: '',
						type: 'credit'
					});
					setSuccess('');
					// Optionally navigate back to wallet page
					// navigate('/wallet');
				}, 2000);
			}
		} catch (error) {
			console.error('Error creating transaction:', error);
			setError(
				error.message || 'Failed to create transaction. Please try again.'
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = () => {
		navigate('/wallet');
	};

	return (
		<div className="creditwallet-page">
			<div className="creditwallet-card">
				<h1>Credit/Debit Wallet</h1>
				<p className="creditwallet-desc">
					Add or deduct funds from a landlord's wallet. Enter the amount, select
					the landlord, and provide a reason.
				</p>

				{error && (
					<div
						style={{
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
					<div
						style={{
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

				<form onSubmit={handleSubmit}>
					<div className="creditwallet-form-row">
						<div className="creditwallet-form-group">
							<label>Transaction Type*</label>
							<select
								name="type"
								value={form.type}
								onChange={handleChange}
								style={{ padding: '8px', width: '100%' }}>
								<option value="credit">Credit</option>
								<option value="debit">Debit</option>
							</select>
						</div>
						<div className="creditwallet-form-group">
							<label>Enter Amount*</label>
							<input
								type="number"
								name="amount"
								placeholder="Amount"
								value={form.amount}
								onChange={handleChange}
								min="0"
								step="0.01"
								required
							/>
						</div>
					</div>

					<div
						className="creditwallet-form-group"
						style={{ position: 'relative' }}
						ref={suggestionsRef}>
						<label>Landlord Name*</label>
						<input
							type="text"
							name="landlord"
							placeholder="Search landlord by name or email"
							value={form.landlord}
							onChange={handleChange}
							onFocus={() => {
								filterLandlords(landlords, form.landlord);
								setShowSuggestions(true);
							}}
							required
						/>
						{showSuggestions && filteredLandlords.length > 0 && (
							<ul
								style={{
									position: 'absolute',
									top: '100%',
									left: 0,
									right: 0,
									backgroundColor: 'white',
									border: '1px solid #ddd',
									borderRadius: '4px',
									maxHeight: '200px',
									overflowY: 'auto',
									zIndex: 1000,
									listStyle: 'none',
									padding: 0,
									margin: 0,
									boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
								}}>
								{filteredLandlords.map(landlord => (
									<li
										key={landlord._id}
										onClick={() => handleLandlordSelect(landlord)}
										onMouseDown={e => e.preventDefault()} // Prevent input blur
										style={{
											padding: '10px',
											cursor: 'pointer',
											borderBottom: '1px solid #eee'
										}}
										onMouseEnter={e =>
											(e.target.style.backgroundColor = '#f5f5f5')
										}
										onMouseLeave={e =>
											(e.target.style.backgroundColor = 'white')
										}>
										<div style={{ fontWeight: 'bold' }}>{landlord.name}</div>
										<div style={{ fontSize: '0.9em', color: '#666' }}>
											{landlord.email}
										</div>
									</li>
								))}
							</ul>
						)}
					</div>

					<div className="creditwallet-form-group">
						<label>Reason for balance update*</label>
						<textarea
							name="reason"
							placeholder="e.g., Sync with payment gateway, Refund for cancelled booking, etc."
							value={form.reason}
							onChange={handleChange}
							rows={3}
							required
						/>
					</div>

					<div className="creditwallet-actions">
						<button className="submit-btn" type="submit" disabled={submitting}>
							{submitting ? 'Processing...' : 'Submit'}
						</button>
						<button
							className="cancel-btn"
							type="button"
							onClick={handleCancel}
							disabled={submitting}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreditWallet;
