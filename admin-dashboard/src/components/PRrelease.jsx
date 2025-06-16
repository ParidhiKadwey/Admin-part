import React, { useState, useEffect } from "react";
import SideNavBar from './SideNavBar';
import SideBar from './SideBar';

const PressReleaseManagement = () => {
  const [pressReleases, setPressReleases] = useState([]);
  const [newPressRelease, setNewPressRelease] = useState({
    doc_name: "",
    heading: "",
    content: "",
    meta_data: "",
    link: "",
    references: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = sessionStorage.getItem("usertoken");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleRow = (index) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    async function fetchPressReleases() {
      try {
        const response = await fetch("http://api.mptradeportal.org/pressrelease", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setPressReleases(data?.docs || []);
      } catch (error) {
        console.error("Error fetching press releases:", error);
        setError("Failed to load press releases. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchPressReleases();
  }, [token]);

  const handleAddPressRelease = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://api.mptradeportal.org/pressrelease/addPress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newPressRelease)
      });

      if (response.ok) {
        const newItem = await response.json();
        setPressReleases([...pressReleases, newItem]);
        setNewPressRelease({
          doc_name: "",
          heading: "",
          content: "",
          meta_data: "",
          link: "",
          references: ""
        });
      }
    } catch (error) {
      console.error("Error adding press release:", error);
      alert("Failed to add press release. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this press release?")) return;
    
    try {
      const response = await fetch(`http://api.mptradeportal.org/pressrelease/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setPressReleases(pressReleases.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error("Error deleting press release:", error);
      alert("Failed to delete press release. Please try again.");
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
            {/* {loading ? (
              <div className="loading-spinner"></div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : ( */}
              <div className="press-release-content">
                {/* Add Press Release Form */}
                <div className="content-card">
                  <div className="card-header">
                    <h2 className="page-title">Add New Press Release</h2>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleAddPressRelease}>
                      <div className="form-grid">
                        {Object.keys(newPressRelease).map((key) => (
                          <div className="form-group" key={key}>
                            <label>{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</label>
                            {key === "content" ? (
                              <textarea
                                className="form-control"
                                placeholder={`Enter ${key.replace("_", " ")}`}
                                value={newPressRelease[key]}
                                onChange={(e) =>
                                  setNewPressRelease({ ...newPressRelease, [key]: e.target.value })
                                }
                                required
                                rows="4"
                              />
                            ) : (
                              <input
                                type={key === "link" ? "url" : "text"}
                                className="form-control"
                                placeholder={`Enter ${key.replace("_", " ")}`}
                                value={newPressRelease[key]}
                                onChange={(e) =>
                                  setNewPressRelease({ ...newPressRelease, [key]: e.target.value })
                                }
                                required
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="action-btn primary-btn">
                          Save Press Release
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* List of Press Releases */}
                <div className="content-card">
                  <div className="card-header">
                    <h2 className="page-title">Press Releases</h2>
                    <div className="total-items">{pressReleases.length} press releases found</div>
                  </div>
                  <div className="card-body">
                    <div className="table-section">
                      <div className="table-card">
                        <div className="table-responsive">
                          <table className="participants-table">
                            <thead>
                              <tr>
                                <th>SNo.</th>
                                <th>Doc Name</th>
                                <th>Heading</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pressReleases.length > 0 ? (
                                pressReleases.map((p, index) => (
                                  <React.Fragment key={p._id || index}>
                                    <tr>
                                      <td>{index + 1}</td>
                                      <td>{p.doc_name}</td>
                                      <td>{p.heading}</td>
                                      <td className="actions-cell">
                                        <button 
                                          className="action-btn toggle-btn"
                                          onClick={() => toggleRow(index)}
                                        >
                                          {expandedRows[index] ? '▲ Hide Details' : '▼ Show Details'}
                                        </button>
                                        <button 
                                          className="action-btn delete-btn"
                                          onClick={() => handleDelete(p._id)}
                                        >
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                    {expandedRows[index] && (
                                      <tr className="expanded-row">
                                        <td colSpan="4">
                                          <div className="details-container">
                                            <div className="detail-item">
                                              <strong>Content:</strong>
                                              <p>{p.content}</p>
                                            </div>
                                            <div className="detail-item">
                                              <strong>Meta Data:</strong>
                                              <p>{p.meta_data}</p>
                                            </div>
                                            <div className="detail-item">
                                              <strong>Link:</strong>
                                              {p.link && (
                                                <a href={p.link} target="_blank" rel="noopener noreferrer" className="link-btn">
                                                  View Link
                                                </a>
                                              )}
                                            </div>
                                            <div className="detail-item">
                                              <strong>References:</strong>
                                              <p>{p.references}</p>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="no-data">
                                    No press releases available
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
            {/* // )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressReleaseManagement;