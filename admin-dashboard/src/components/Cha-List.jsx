import React from "react";
import { useNavigate } from "react-router-dom";
import SideNavBar from './SideNavBar';
import SideBar from './SideBar';

const UserTable = ({ users }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAction = (userId, actionType) => {
    const user = users.find(u => u._id === userId);
    if (!user) return;

    if (actionType === 'deactivate') {
      if (window.confirm(`Are you sure you want to deactivate ${user.firstName} ${user.lastName}?`)) {
        navigate(`/tradeadmin/AdminList/DeleteUser?uid=${userId}`);
      }
    } else if (actionType === 'permission') {
      const permitData = JSON.stringify(user.portal_access).replace(/"/g, "'");
      navigate(`/tradeadmin/Permission?uid=${userId}&nav=VendorList&permit=${permitData}`);
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
              <h2 className="page-title">User Management</h2>
              
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
                        <tr key={user._id}>
                          <td>{index + 1}</td>
                          <td>{`${user.firstName} ${user.lastName}`}</td>
                          <td>{user.email}</td>
                          <td>{user.country}</td>
                          <td>{user.companyName}</td>
                          <td>{user.companyRole}</td>
                          <td className="action-buttons">
                            <button
                              onClick={() => handleAction(user._id, 'deactivate')}
                              className="action-btn delete-btn"
                            >
                              Deactivate
                            </button>
                            <button
                              onClick={() => handleAction(user._id, 'permission')}
                              className="action-btn permission-btn"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;