import React, { useEffect, useState } from "react";
import SideNavBar from './SideNavBar';
import SideBar from './SideBar';
import axios from "axios";
import API_URL from "../services/apiConfig";

const AdminUserList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const token = sessionStorage.getItem("usertoken");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/admins`);
        setUsers(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch admin users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDeactivate = async (uid) => {
    try {
      const response = await axios.delete(`${API_URL}/user/admins/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setUsers(prevUsers => prevUsers.filter(user => user._id !== uid));
      }
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`side-nav-container ${isSidebarOpen ? 'open' : 'closed'}`}>
        <SideNavBar isOpen={isSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className={`main-content-area ${!isSidebarOpen ? 'expanded' : ''}`}>
        <div className="top-sidebar-container">
          <SideBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>

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
                      users.map((user, index) => (
                        <tr key={user._id}>
                          <td>{index + 1}</td>
                          <td>{`${user.firstName} ${user.lastName}`}</td>
                          <td>{user.email}</td>
                          <td>{user.country}</td>
                          <td>{user.companyName}</td>
                          <td>{user.companyRole}</td>
                          <td>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDeactivate(user._id)}
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
