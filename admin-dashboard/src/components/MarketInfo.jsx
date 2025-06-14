import React, { useState, useEffect } from "react";
import SideNavBar from './SideNavBar';
import SideBar from './SideBar';

const MarketInfo = () => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const token = sessionStorage.getItem("usertoken");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    async function fetchMarketInfo() {
      try {
        const response = await fetch("http://api.mptradeportal.org/marketinfo", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setMarketData(data?.result || []);
      } catch (error) {
        console.error("Error fetching market info:", error);
        setError("Failed to load market information. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchMarketInfo();
  }, [token]);

  const updateStatus = async (id, status) => {
  //   try {
  //     await fetch(`http://api.mptradeportal.org/marketinfo/updateStatus?id=${id}&status=${status}`, {
  //       method: "PUT",
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //   //   setMarketData(prevData =>
  //   //     prevData.map(item => (item._id === id ? { ...item, status } : item))
  //   // } catch (error) {
  //     console.error("Error updating status:", error);
  //     alert("Failed to update status. Please try again.");
  //   }
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
            {/* {loading ? (
              <div className="loading-spinner"></div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : ( */}
              <div className="content-card">
                <div className="card-header">
                  <h2 className="page-title">Market Information</h2>
                  <div className="total-items">{marketData.length} entries found</div>
                </div>
                
                <div className="table-section">
                  <div className="table-card">
                    <div className="table-responsive">
                      <table className="participants-table">
                        <thead>
                          <tr>
                            <th>Section No.</th>
                            <th>Name & Contact</th>
                            <th>Post</th>
                            <th>Country of Interest</th>
                            <th>HS Code</th>
                            <th width="15%">Note</th>
                            <th>Status</th>
                            <th>Change Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marketData.length > 0 ? (
                            marketData.map((item) => (
                              <tr key={item._id}>
                                <td>{item.section}</td>
                                <td>
                                  <div className="contact-info">
                                    <div className="name">{item.name}</div>
                                    <div className="contact">{item.contact}</div>
                                    <div className="email">{item.email}</div>
                                  </div>
                                </td>
                                <td>{item.post}</td>
                                <td>{item.country_of_interest?.join(", ")}</td>
                                <td>{item.hs_code?.join(", ")}</td>
                                <td className="note-cell">{item.note}</td>
                                <td>
                                  <span className={`status-badge ${item.status.toLowerCase()}`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="status-actions">
                                  <button
                                    className={`status-btn ${item.status === "To-Do" ? "active" : ""}`}
                                    onClick={() => updateStatus(item._id, "To-Do")}
                                  >
                                    To-Do
                                  </button>
                                  <button
                                    className={`status-btn ${item.status === "WIP" ? "active" : ""}`}
                                    onClick={() => updateStatus(item._id, "WIP")}
                                  >
                                    WIP
                                  </button>
                                  <button
                                    className={`status-btn ${item.status === "Completed" ? "active" : ""}`}
                                    onClick={() => updateStatus(item._id, "Completed")}
                                  >
                                    Completed
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="no-data">
                                No market information available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketInfo;