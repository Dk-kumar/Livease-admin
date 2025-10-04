import React, { useState } from 'react';
import './wallet.scss';

function Wallet() {
  const [balance] = useState(15000);
  const [transactions] = useState([
    { amount: 75000, type: 'Rent', date: '12/05/2025' },
    { amount: 75000, type: 'Deposit', date: '12/05/2025' },
    { amount: 75000, type: 'Credit', date: '12/05/2025' },
    { amount: 75000, type: 'Debit', date: '12/05/2025' },
    { amount: 75000, type: 'Deposit', date: '12/05/2025' },
    { amount: 75000, type: 'Debit', date: '12/05/2025' },
    { amount: 75000, type: 'Credit', date: '12/05/2025' },
    { amount: 75000, type: 'Rent', date: '12/05/2025' },
    { amount: 75000, type: 'Debit', date: '12/05/2025' },
    { amount: 75000, type: 'Credit', date: '12/05/2025' },
  ]);

  return (
    <div className="wallet-page">
      <div className="wallet-header-row">
        <div>
          <h1>Wallet</h1>
          <p>Manage Your Task and Activities.</p>
        </div>
        <div className="wallet-header-actions">
          <button><img src="/assets/icon (1).png" alt="add" /> Credit Wallet</button>
          <button><img src="/assets/icon (1).png" alt="add" /> Debit Wallet</button>
          <button><img src="/assets/icon (1).png" alt="add" /> Update Balance</button>
        </div>
      </div>
      <div className="wallet-balance-section">
        <div className="wallet-balance-label">Your Available Balance is</div>
        <div className="wallet-balance-box">
          <span className="wallet-balance-credits">
            <img src="/assets/cryptocurrency-color_gold (1).png" alt="coin" /> Credits
          </span>
          <span className="wallet-balance-value">{balance.toLocaleString()}</span>
        </div>
      </div>
      <div className="wallet-table-controls">
        <input className="wallet-search" placeholder="Search" />
        <div className="wallet-table-filters">
          <button>
            <img src="/assets/Icon (4).png" alt="date" style={{ width: 18, marginRight: 6 }} />
            Date
          </button>
          <button>Status</button>
        </div>
      </div>
      <div className="wallet-table-wrapper">
        <table className="wallet-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, idx) => (
              <tr key={idx}>
                <td><input type="checkbox" /></td>
                <td>{txn.amount}</td>
                <td>{txn.type}</td>
                <td>{txn.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="wallet-pagination">
          1 of 100 <span className="wallet-next">Next &gt;</span>
        </div>
      </div>
    </div>
  );
}

export default Wallet;