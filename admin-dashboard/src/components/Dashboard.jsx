import React, { useEffect, useState } from 'react';
import SideNavbar from './SideNavBar';
import SideBar from './SideBar';
import { FaSearch } from 'react-icons/fa';
import API_URL from "../services/apiConfig";
import axios from "axios";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allParticipants, setAllParticipants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const fetchParticipants = async (page = 1, limit = itemsPerPage) => {
    try {
      const res = await axios.get(`${API_URL}/user?page=${page}&limit=${limit}`);
      console.log("API Response:", res.data);
      if (res.data.success) {
        setAllParticipants(res.data.data); // you may load all from backend if backend allows
      } else {
        setAllParticipants([]);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
      setAllParticipants([]);
    }
  };

  useEffect(() => {
    fetchParticipants(currentPage, itemsPerPage);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // reset page when searching
  };

  const handleDelete = (uid) => {
    if (window.confirm("Are you sure you want to delete this participant?")) {
      console.log("Deleting participant:", uid);
      // TODO: call delete API
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(filteredParticipants.length / itemsPerPage)) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePageSizeChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const filteredParticipants = allParticipants.filter((p) =>
    searchTerm === '' ||
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedParticipants = filteredParticipants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`side-nav-container ${isSidebarOpen ? 'open' : 'closed'}`}>
        <SideNavbar isOpen={isSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className={`main-content-area ${!isSidebarOpen ? 'expanded' : ''}`}>
        <div className="top-sidebar-container">
          <SideBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>

        <div className="padding-container">
          <div className="content-area">
            <div className="content-card">
              <h2 className="page-title">Vanijya Utsav 2021</h2>

              {/* Search */}
              <form onSubmit={handleSearch} className="search-input-group">
                <input
                  type="text"
                  placeholder="Search by name/email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <FaSearch className="search-icon" />
                </button>
              </form>

              {/* Page Size Dropdown */}
              <div className="pagination-controls">
                <label>Items per page: </label>
                <select value={itemsPerPage} onChange={handlePageSizeChange}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="participants-table">
                  <thead>
                    <tr>
                      <th>SNo.</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Designation</th>
                      <th>Organization</th>
                      <th>Consent</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedParticipants.length > 0 ? (
                      paginatedParticipants.map((p, index) => (
                        <tr key={p._id || index}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td>{p.name}</td>
                          <td>{p.phone}</td>
                          <td>{p.email}</td>
                          <td>{p.designation}</td>
                          <td>{p.name_of_org}</td>
                          <td>{p.consent}</td>
                          <td>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDelete(p._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center' }}>No participants found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="pagination-buttons">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
