import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from './SideBar';
import SideNavBar from "./SideNavBar";

const AdminUserList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = sessionStorage.getItem("usertoken");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        const response = await fetch("http://api.mptradeportal.org/user/admin", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setUsers(data?.docs || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [token]);

  const handleDeactivate = async (uid) => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      try {
        const response = await fetch(`http://api.mptradeportal.org/user/admin/${uid}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          setUsers(users.filter((user) => user._id !== uid));
        }
      } catch (error) {
        console.error("Error deactivating user:", error);
      }
    }
  };

  const handlePermission = (uid, portalAccess) => {
    navigate(`/tradeadmin/Permission?uid=${uid}&nav=VendorList&permit=${encodeURIComponent(JSON.stringify(portalAccess || {}))}`);
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
              
              {isLoading ? (
                <div className="loading-message">Loading users...</div>
              ) : (
                <div className="table-responsive">
                  <table className="participants-table">
                    <thead>
                      <tr>
                        <th>SNo.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Country</th>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user, index) => (
                          <tr key={user._id || index}>
                            <td>{index + 1}</td>
                            <td>{`${user.firstName || ''} ${user.lastName || ''}`}</td>
                            <td>{user.email || '-'}</td>
                            <td>{user.country || '-'}</td>
                            <td>{user.companyName || '-'}</td>
                            <td>{user.companyRole || '-'}</td>
                            <td className="action-buttons">
                              <button
                                onClick={() => handleDeactivate(user._id)}
                                className="action-btn delete-btn"
                                disabled={!user._id}
                              >
                                Deactivate
                              </button>
                              <button
                                onClick={() => handlePermission(user._id, user.portal_access)}
                                className="action-btn permission-btn"
                                disabled={!user._id}
                              >
                                Permission
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="no-data">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;