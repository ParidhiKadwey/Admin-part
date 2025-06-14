import React, { useEffect, useState } from "react";
import SideNavBar from './SideNavBar';
import SideBar from './SideBar';

const AdminUserList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const token = sessionStorage.getItem("usertoken");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://api.mptradeportal.org/user/admin", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setUsers(data?.docs || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
    fetchUsers();
  }, [token]);

  const handleDeactivate = async (uid) => {
    try {
      const response = await fetch(`http://api.mptradeportal.org/user/admin/${uid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== uid));
      }
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <div className={`side-nav-container ${isSidebarOpen ? 'open' : 'closed'}`}>
        <SideNavBar isOpen={isSidebarOpen} />
      </div>

      {/* Main Content Area */}
      <div className={`main-content-area ${!isSidebarOpen ? 'expanded' : ''}`}>
        {/* Top Navigation */}
        <div className="top-sidebar-container">
          <SideBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>

        {/* Page Content */}
        <div className="padding-container">
          <div className="content-area">
            <div className="content-card">
              <h2 className="page-title">Registered Admin Users</h2>
              
              <div className="table-responsive">
                <table className="participants-table">
                  <thead>
                    <tr>
                      <th>SNo.</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Country</th>
                      <th>Company Name</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((r, index) => (
                        <tr key={r._id}>
                          <td>{index + 1}</td>
                          <td>{r.firstName + " " + r.lastName}</td>
                          <td>{r.email}</td>
                          <td>{r.country}</td>
                          <td>{r.companyName}</td>
                          <td>{r.companyRole}</td>
                          <td>
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => handleDeactivate(r._id)}
                            >
                              Deactivate
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="no-data">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;