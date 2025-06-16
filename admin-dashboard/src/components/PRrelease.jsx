import React, { useState, useEffect } from "react";
import SideNavBar from './SideNavBar';
import SideBar from './SideBar';
import axios from "axios";
import API_URL from "../services/apiConfig";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchPressReleases = async (page = 1, limit = itemsPerPage) => {
    try {
      const res = await axios.get(`${API_URL}/press/?page=${page}&limit=${limit}`);
      if (res.data.success) {
        setPressReleases(res.data.docs);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage);
      }
    } catch (error) {
      console.error("Error fetching press releases:", error);
    }
  };

  useEffect(() => {
    fetchPressReleases(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handleAddPressRelease = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newPressRelease };
      const response = await axios.post(`${API_URL}/press/new/`, payload);
      if (response.data.success) {
        setNewPressRelease({
          doc_name: "",
          heading: "",
          content: "",
          meta_data: "",
          link: "",
          references: ""
        });
        fetchPressReleases(currentPage, itemsPerPage);
      }
    } catch (error) {
      console.error("Error adding press release:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this press release?")) return;
    try {
      const res = await axios.delete(`${API_URL}/press/${id}`);
      if (res.data.success) {
        setPressReleases((prev) => prev.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error("Error deleting press release:", error);
    }
  };

  const handlePageSizeChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="dashboard-container">
      <div className={`side-nav-container ${isSidebarOpen ? 'open' : 'closed'}`}>
        <SideNavBar isOpen={isSidebarOpen} />
      </div>

      <div className={`main-content-area ${!isSidebarOpen ? 'expanded' : ''}`}>
        <div className="top-sidebar-container">
          <SideBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>

        <div className="padding-container">
          <div className="content-area">
            <div className="content-card">
              <h2 className="page-title">Press Release Management</h2>

              <div className="form-section">
                <div className="form-card">
                  <h3>Add New Press Release</h3>
                  <form onSubmit={handleAddPressRelease}>
                    {Object.keys(newPressRelease).map((key) => (
                      <div className="form-group" key={key}>
                        <label>{key.replace(/_/g, ' ').toUpperCase()}</label>
                        {key === "content" ? (
                          <textarea
                            value={newPressRelease[key]}
                            onChange={(e) => setNewPressRelease({ ...newPressRelease, [key]: e.target.value })}
                            required
                          />
                        ) : (
                          <input
                            type={key === "link" ? "url" : "text"}
                            value={newPressRelease[key]}
                            onChange={(e) => setNewPressRelease({ ...newPressRelease, [key]: e.target.value })}
                            required
                          />
                        )}
                      </div>
                    ))}
                    <button type="submit" className="action-btn primary-btn">Add Press Release</button>
                  </form>
                </div>
              </div>

              {/* Table */}
              <div className="table-section">
                <div className="table-card">
                  <div className="d-flex justify-between align-items-center mb-3">
                    <h3>Existing Press Releases</h3>
                    <div className="page-size-control">
                      <label>Items per page: </label>
                      <select value={itemsPerPage} onChange={handlePageSizeChange}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                      </select>
                    </div>
                  </div>

                  <table className="participants-table">
                    <thead>
                      <tr>
                        <th>SNo.</th>
                        <th>Doc Name</th>
                        <th>Heading</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pressReleases.length > 0 ? (
                        pressReleases.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{item.doc_name}</td>
                            <td>{item.heading}</td>
                            <td>
                              <button onClick={() => handleDelete(item._id)} className="action-btn delete-btn">Delete</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">No Press Releases Found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="pagination">
                    <button onClick={handlePrev} disabled={currentPage === 1}>Previous</button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={currentPage === i + 1 ? 'active' : ''}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressReleaseManagement;
