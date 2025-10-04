import React, { useState } from 'react';
import './userManagement.scss';

function UserManagement() {
  const [users] = useState([
    {
      name: "Ramesh Sharma",
      email: "xyx@gmail.com",
      number: "+91 1112233344",
      status: "Active",
      verification: "Done",
      avatar: "/assets/3d_avatar_1.png",
    },
    {
      name: "Ramesh Sharma",
      email: "xyx@gmail.com",
      number: "+91 1112233344",
      status: "Inactive",
      verification: "Pending",
      avatar: "/assets/3d_avatar_1.png",
    },
    {
      name: "Ramesh Sharma",
      email: "xyx@gmail.com",
      number: "+91 1112233344",
      status: "Active",
      verification: "Done",
      avatar: "/assets/3d_avatar_1.png",
    },
    {
      name: "Ramesh Sharma",
      email: "xyx@gmail.com",
      number: "+91 1112233344",
      status: "Inactive",
      verification: "Failed",
      avatar: "/assets/3d_avatar_1.png",
    },
    {
      name: "Ramesh Sharma",
      email: "xyx@gmail.com",
      number: "+91 1112233344",
      status: "Active",
      verification: "Pending",
      avatar: "/assets/3d_avatar_1.png",
    },
    {
      name: "Ramesh Sharma",
      email: "xyx@gmail.com",
      number: "+91 1112233344",
      status: "Inactive",
      verification: "Failed",
      avatar: "/assets/3d_avatar_1.png",
    },
    {
      name: "Ramesh Sharma",
      email: "xyx@gmail.com",
      number: "+91 1112233344",
      status: "Active",
      verification: "Done",
      avatar: "/assets/3d_avatar_1.png",
    },
    {
      name: "Ramesh Sharma",
      email: "xyx@gmail.com",
      number: "+91 1112233344",
      status: "Inactive",
      verification: "Pending",
      avatar: "/assets/3d_avatar_1.png",
    },
    {
      name: "Ramesh Sharma",
      email: "xyx@gmail.com",
      number: "+91 1112233344",
      status: "Active",
      verification: "Done",
      avatar: "/assets/3d_avatar_1.png",
    },
    {
      name: "Ramesh Sharma",
      email: "xyx@gmail.com",
      number: "+91 1112233344",
      status: "Inactive",
      verification: "Failed",
      avatar: "/assets/3d_avatar_1.png",
    },
  ]);

  return (
    <div className="user-management">
      <div className="user-management__header">
        <div>
          <h1>User Management</h1>
          <p>Manage Your Task and Activities.</p>
        </div>
        <button className="user-management__new-tenant"><img src='/assets/iconplus.png'></img><span> New Tenant</span></button>
      </div>
      <div className="user-management__controls">
        <input className="user-management__search" placeholder="Search" />
        <div className="user-management__filters">
          <button><img src='/assets/Icon (2).png'></img><span>Date</span></button>
          <button><img src='/assets/Icon (3).png'></img><span>Filter</span></button>
          <button><img src='/assets/icondownarrow.png'></img><span>Status</span></button>
        </div>
      </div>
      <div className="user-management__table-wrapper">
        <table className="user-management__table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Name</th>
              <th>Email</th>
              <th>Number</th>
              <th>Status</th>
              <th>Verification</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx}>
                <td><input type="checkbox" /></td>
                <td>
                  <img src={user.avatar} alt="avatar" className="user-management__avatar" />
                  {user.name}
                </td>
                <td>{user.email}</td>
                <td>{user.number}</td>
                <td className={user.status === "Active" ? "active" : "inactive"}>
                  {user.status}
                </td>
                <td className={
                  user.verification === "Done"
                    ? "done"
                    : user.verification === "Pending"
                    ? "pending"
                    : "failed"
                }>
                  {user.verification}
                </td>
                <td>
                  <span className="user-management__action">
                    <img src="/assets/Icon (1).png" alt="edit" />
                  </span>
                  <span className="user-management__action">
                    <img src="/assets/icon.png" alt="delete" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="user-management__pagination">
          1 of 100 <span className="user-management__next">Next &gt;</span>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;