import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideNavBar from './SideNavBar';
import SideBar from './SideBar';

const MeetingsList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("usertoken");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const response = await fetch("http://api.mptradeportal.org/meetings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setMeetings(data?.docs || []);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setError("Failed to load meetings. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchMeetings();
  }, [token]);

  const handleRowClick = (meetingId) => {
    navigate(`/meetings/${meetingId}`);
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
            <div className="content-header">
              <h2 className="page-title">Meetings Management</h2>
              <button 
                className="action-btn primary-btn"
                onClick={() => navigate('/Meetings/new')}
              >
                + Add New Meeting
              </button>
            </div>

            {/* {loading ? ( */}
              {/* <div className="loading-spinner">Loading...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : ( */}
              <div className="content-card">
                <div className="table-header">
                  <span className="total-items">{meetings.length} meetings found</span>
                </div>
                
                <div className="table-responsive">
                  <table className="participants-table">
                    <thead>
                      <tr>
                        <th>SNo.</th>
                        <th>Company Details</th>
                        <th>User Details</th>
                        <th>Meeting Details</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meetings.map((meeting, index) => (
                        <tr key={meeting._id} onClick={() => handleRowClick(meeting._id)}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="company-details">
                              <div className="foreign-company">
                                <strong>Foreign Company:</strong>
                                <p>{meeting.foreign_company?.company_name || 'N/A'}, {meeting.foreign_company?.country || ''}</p>
                              </div>
                              <div className="indian-company">
                                <strong>Indian Company:</strong>
                                <p>{meeting.indian_company?.name || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="user-details">
                              <p>{meeting.user?.firstName} {meeting.user?.lastName}</p>
                              <p>{meeting.user?.email || 'N/A'}</p>
                            </div>
                          </td>
                          <td>
                            <div className="meeting-meta">
                              <p><strong>Date:</strong> {new Date(meeting.date).toLocaleDateString()}</p>
                              <p><strong>Time:</strong> {meeting.time}</p>
                              <span className={`status-badge ${meeting.status?.toLowerCase()}`}>
                                {meeting.status}
                              </span>
                            </div>
                          </td>
                          <td>
                            <button 
                              className="action-btn edit-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/meetings/edit/${meeting._id}`);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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