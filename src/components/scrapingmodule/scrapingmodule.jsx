import React, { useState } from 'react';
import './scrapingmodule.scss';

const dummyRows = Array(8).fill({
  property: '2 BHK',
  avatar: '/assets/3d_avatar_1.png',
  description: 'Spacious 2 BHK with balcony ...',
  mobile: '+91 111223334',
  email: 'xyx@gmail.com',
  listedBy: 'Sankket',
  area: 'Andheri W...',
});

function ScrapingModule() {
  const [form, setForm] = useState({
    link: '',
    source: 'Facebook',
    keywords: '',
  });

  const [rows] = useState(dummyRows);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="scraping-module-page">
      <div className="scraping-module-card">
        <h1>Scraping Module</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
        <form className="scraping-module-form">
          <div className="form-group">
            <label>Enter Link*</label>
            <input
              type="text"
              name="link"
              placeholder="Link"
              value={form.link}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Source Selection</label>
            <select
              name="source"
              value={form.source}
              onChange={handleChange}
            >
              <option>Facebook</option>
              <option>99acres</option>
              <option>MagicBricks</option>
            </select>
          </div>
          <div className="form-group">
            <label>Enter Keywords*</label>
            <input
              type="text"
              name="keywords"
              placeholder="Keywords"
              value={form.keywords}
              onChange={handleChange}
            />
          </div>
          <div className="scraping-module-actions">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
      <div className="scraping-module-table-wrapper">
        <table className="scraping-module-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Property</th>
              <th>Description</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Listed by</th>
              <th>Area</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td><input type="checkbox" /></td>
                <td>
                  <img src={row.avatar} alt="avatar" className="scraping-module-avatar" />
                  {row.property}
                </td>
                <td>{row.description}</td>
                <td>{row.mobile}</td>
                <td>{row.email}</td>
                <td>{row.listedBy}</td>
                <td>{row.area}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="scraping-module-pagination">
          1 of 100 <span className="scraping-module-next">Next &gt;</span>
        </div>
        <div className="scraping-module-upload-row">
          <button className="upload-btn">Upload</button>
        </div>
      </div>
    </div>
  );
}

export default ScrapingModule;