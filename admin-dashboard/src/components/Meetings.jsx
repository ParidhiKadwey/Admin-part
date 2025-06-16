import  API_URL  from "../services/apiConfig";
import React, { useState, useEffect } from "react";
import SideNavBar from "./SideNavBar";
import SideBar from "./SideBar";
import axios from "axios";

const MeetingsList = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeetings = meetings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(meetings.length / itemsPerPage);
  const token = sessionStorage.getItem("usertoken");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const response = await axios.get(`${API_URL}/tradedetail/meeting`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeetings(response.data?.docs || []);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setError("Failed to load meetings. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchMeetings();
  }, [token]);

  const pageRangeDisplayed = 5;
  let startPage = Math.max(1, currentPage - Math.floor(pageRangeDisplayed / 2));
  let endPage = startPage + pageRangeDisplayed - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - pageRangeDisplayed + 1);
  }
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <div
        className={`side-nav-container ${isSidebarOpen ? "open" : "closed"}`}
      >
        <SideNavBar isOpen={isSidebarOpen} />
      </div>

      {/* Main Content Area */}
      <div className={`main-content-area ${!isSidebarOpen ? "expanded" : ""}`}>
        {/* Top Navigation */}
        <div className="top-sidebar-container">
          <SideBar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
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
                <h2 className="page-title">Meetings Management</h2>
                <div className="total-items">
                  {meetings.length} meetings found
                </div>
              </div>

              <div className="table-section">
                <div className="table-card">
                  <div className="table-responsive">
                    <table className="participants-table">
                      <thead>
                        <tr>
                          <th>SNo.</th>
                          <th>Company Details</th>
                          <th>User Details</th>
                          <th>Meeting Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentMeetings.length > 0 ? (
                          currentMeetings.map((meeting, index) => (
                            <tr key={meeting._id}>
                              <td>{indexOfFirstItem + index + 1}</td>
                              <td>
                                <div className="company-details">
                                  <div className="foreign-company">
                                    <strong>Foreign Company:</strong>
                                    <p>
                                      {meeting.foreign_company?.company_name},{" "}
                                      {meeting.foreign_company?.city},{" "}
                                      {meeting.foreign_company?.country}
                                    </p>
                                  </div>
                                  <div className="indian-company">
                                    <strong>Indian Company:</strong>
                                    <p>
                                      {meeting.indian_company?.name},{" "}
                                      {meeting.indian_company?.address}
                                    </p>
                                    <p className="contact-info">
                                      <small>
                                        Contact:{" "}
                                        {meeting.indian_company?.contact_name}
                                      </small>
                                      <br />
                                      <small>
                                        Email: {meeting.indian_company?.email}
                                      </small>
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="user-details">
                                  <p>
                                    {meeting.user?.civility}{" "}
                                    {meeting.user?.firstName}{" "}
                                    {meeting.user?.lastName}
                                  </p>
                                  <p className="contact-info">
                                    <small>Email: {meeting.user?.email}</small>
                                  </p>
                                </div>
                              </td>
                              <td>
                                <div className="meeting-meta">
                                  {meeting.date && (
                                    <p>
                                      <strong>Date:</strong>{" "}
                                      {new Date(
                                        meeting.date
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                  {meeting.status && (
                                    <span
                                      className={`status-badge ${meeting.status.toLowerCase()}`}
                                    >
                                      {meeting.status}
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="no-data">
                              No meetings available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div
                className="pagination-controls"
                style={{ marginTop: "16px", textAlign: "center" }}
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {startPage > 1 && <span style={{ margin: "0 4px" }}>...</span>}
                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    style={{
                      margin: "0 2px",
                      fontWeight: currentPage === num ? "bold" : "normal",
                      background: currentPage === num ? "#007bff" : "#fff",
                      color: currentPage === num ? "#fff" : "#000",
                      border: "1px solid #ccc",
                      borderRadius: "3px",
                      padding: "4px 8px",
                    }}
                  >
                    {num}
                  </button>
                ))}
                {endPage < totalPages && (
                  <span style={{ margin: "0 4px" }}>...</span>
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingsList;
