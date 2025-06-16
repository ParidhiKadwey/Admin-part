import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNavBar from './SideNavBar';
import SideBar from './SideBar';

const VesselList = () => {
  const [vessels, setVessels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("usertoken");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    async function fetchVessels() {
      try {
        setIsLoading(true);
        const response = await fetch("http://api.mptradeportal.org/vessels", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setVessels(data?.docs || []);
      } catch (error) {
        console.error("Error fetching vessels:", error);
        setError("Failed to load vessels. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchVessels();
  }, [token]);

  const handleDeactivate = async (vesselId) => {
    if (window.confirm("Are you sure you want to deactivate this vessel?")) {
      try {
        const response = await fetch(`http://api.mptradeportal.org/vessels/${vesselId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          setVessels(vessels.filter((vessel) => vessel._id !== vesselId));
        }
      } catch (error) {
        console.error("Error deactivating vessel:", error);
        alert("Failed to deactivate vessel. Please try again.");
      }
    }
  };

  const handlePermission = (vesselId, portalAccess) => {
    navigate(`/tradeadmin/Permission?uid=${vesselId}&nav=VesselList&permit=${encodeURIComponent(JSON.stringify(portalAccess || {}))}`);
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
              <div className="card-header">
                <h2 className="page-title">Vessel Management</h2>
                <div className="total-items">{vessels.length} vessels found</div>
              </div>
              
              {/* {isLoading ? (
                <div className="loading-spinner"></div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : ( */}
                <div className="table-section">
                  <div className="table-card">
                    <div className="table-responsive">
                      <table className="participants-table">
                        <thead>
                          <tr>
                            <th>SNo.</th>
                            <th>Vessel Name</th>
                            <th>IMO Number</th>
                            <th>Flag</th>
                            <th>Vessel Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vessels.length > 0 ? (
                            vessels.map((vessel, index) => (
                              <tr key={vessel._id || index}>
                                <td>{index + 1}</td>
                                <td>{vessel.name || '-'}</td>
                                <td>{vessel.imoNumber || '-'}</td>
                                <td>{vessel.flag || '-'}</td>
                                <td>{vessel.type || '-'}</td>
                                <td>
                                  <span className={`status-badge ${vessel.status?.toLowerCase() || 'active'}`}>
                                    {vessel.status || 'Active'}
                                  </span>
                                </td>
                                <td className="actions-cell">
                                  <button
                                    onClick={() => handlePermission(vessel._id, vessel.portal_access)}
                                    className="action-btn primary-btn"
                                    disabled={!vessel._id}
                                  >
                                    Permission
                                  </button>
                                  <button
                                    onClick={() => handleDeactivate(vessel._id)}
                                    className="action-btn delete-btn"
                                    disabled={!vessel._id}
                                  >
                                    Deactivate
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="no-data">
                                No vessels found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              {/* // )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VesselList;