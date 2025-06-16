import React, { useEffect, useState } from "react";
import SideNavBar from './SideNavBar';
import SideBar from './SideBar'; 

const HSCodeManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hsCodes, setHsCodes] = useState([]);
  const [newHSCode, setNewHSCode] = useState({ code: "", detail: "" });
  const token = sessionStorage.getItem("usertoken");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    async function fetchHSCode() {
      try {
        const response = await fetch("http://api.mptradeportal.org/hscode", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setHsCodes(data?.docs || []);
      } catch (error) {
        console.error("Error fetching HS Codes:", error);
      }
    }

    fetchHSCode();
  }, [token]);

  const handleAddHSCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://api.mptradeportal.org/hscode/addHSCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newHSCode)
      });

      if (response.ok) {
        setHsCodes([...hsCodes, newHSCode]);
        setNewHSCode({ code: "", detail: "" });
      }
    } catch (error) {
      console.error("Error adding HS Code:", error);
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
              <h2 className="page-title">HS Code Management</h2>
              
              <div className="hs-code-content">
                {/* Add HS Code Form */}
                <div className="form-section">
                  <div className="form-card">
                    <h3 className="section-title">Add New HS Code</h3>
                    <form onSubmit={handleAddHSCode}>
                      <div className="form-group">
                        <label>Code</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter HS Code"
                          value={newHSCode.code}
                          onChange={(e) => setNewHSCode({ ...newHSCode, code: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Details</label>
                        <textarea
                          className="form-control"
                          placeholder="Enter description"
                          value={newHSCode.detail}
                          onChange={(e) => setNewHSCode({ ...newHSCode, detail: e.target.value })}
                          required
                        />
                      </div>
                      <button type="submit" className="action-btn primary-btn">
                        Add Code
                      </button>
                    </form>
                  </div>
                </div>

                {/* HS Code List */}
                <div className="table-section">
                  <div className="table-card">
                    <h3 className="section-title">Existing HS Codes</h3>
                    <div className="table-responsive">
                      <table className="participants-table">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Details</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hsCodes.length > 0 ? (
                            hsCodes.map((hsCode, index) => (
                              <tr key={index}>
                                <td>{hsCode.code}</td>
                                <td>{hsCode.detail}</td>
                                <td>
                                  <button className="action-btn delete-btn">
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="no-data">
                                No HS Codes available
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
        </div>
      </div>
    </div>
  );
}

export default HSCodeManagement;