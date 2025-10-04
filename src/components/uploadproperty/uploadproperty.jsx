import React, { useState } from 'react';
import './uploadproperty.scss';

const fieldConfig = [
	{
		label: 'Landlord Name',
		name: 'landlord',
		type: 'select',
		options: ['Name', 'Anil Kapoor'],
	},
	{
		label: 'BHK',
		name: 'bhk',
		type: 'select',
		options: ['4 _ BHK', '3 _ BHK', '2 _ BHK'],
	},
	{
		label: 'Tenant Name',
		name: 'tenant',
		type: 'select',
		options: ['Anil Kapoor', 'Ramesh Sharma'],
	},
	{ label: 'Rent', name: 'rent', type: 'text', placeholder: 'Enter Rent Amount' },
	{ label: 'Amenities', name: 'amenities', type: 'text', placeholder: 'Enter Amenities' },
	{ label: 'Deposit', name: 'deposit', type: 'text', placeholder: 'Enter Deposit Amount' },
	{
		label: 'Address',
		name: 'address',
		type: 'text',
		placeholder: 'e.g., 123, 5th Main, Koramangala, Bangalore',
	},
	{ label: 'Available From', name: 'availableFrom', type: 'text', placeholder: 'DD/MM/YY' },
];

function UploadProperty() {
	const [form, setForm] = useState({
		landlord: '',
		bhk: '',
		tenant: '',
		rent: '',
		amenities: '',
		deposit: '',
		address: '',
		availableFrom: '',
	});

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	return (
		<div className="upload-property-page">
			<h1>Add New Property</h1>
			<p className="subtitle">Manage Your Task and Activities.</p>
			<form className="upload-property-form">
				<div className="form-fields-grid">
					{fieldConfig.map((field, idx) => (
						<div className="form-group" key={idx}>
							<label>{field.label}</label>
							{field.type === 'select' ? (
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
						<div className="upload-box">
							<span className="upload-text">Drag-and-drop or browse</span>
						</div>
						<div className="upload-hint">
							max 3 images, supported formats: JPEG, PNG, max 5MB each
						</div>
					</div>
					<div className="form-group">
						<label>Document Upload</label>
						<div className="upload-box">
							<span className="upload-text">Drag-and-drop or browse</span>
						</div>
						<div className="upload-hint">
							max 3 images, supported formats: ownership proof, supported formats: PDF, JPEG, PNG, max 5MB each
						</div>
					</div>
				</div>
				<div className="form-actions">
					<button type="submit" className="save-btn">Save</button>
					<button type="button" className="cancel-btn">Cancel</button>
				</div>
			</form>
		</div>
	);
}

export default UploadProperty;