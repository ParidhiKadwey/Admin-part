import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideNavBar from './SideNavBar';
import SideBar from './SideBar';
import axios from "axios";



const FAQManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "", segment: "" });
  const [isLoading, setIsLoading] = useState(true);
  const token = sessionStorage.getItem("usertoken");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    async function fetchFAQs() {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/ita/faq/${uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setFaqs(data?.results || []);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFAQs();
  }, [token]);

  const handleAddFAQ = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/ita/faq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newFAQ)
      });

      if (response.ok) {
        setFaqs([...faqs, newFAQ]);
        setNewFAQ({ question: "", answer: "", segment: "" });
      }
    } catch (error) {
      console.error("Error adding FAQ:", error);
    }
  };

  const handleDelete = async (uid) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        const response = await axios.get(`${API_URL}/ita/faq/${uid}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          setFaqs(faqs.filter(faq => faq._id !== uid));
        }
      } catch (error) {
        console.error("Error deleting FAQ:", error);
      }
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
              <h2 className="page-title">FAQ Management</h2>
              
              {/* Add FAQ Form */}
              <div className="form-container">
                <h3 className="section-title">Add New FAQ</h3>
                <form onSubmit={handleAddFAQ} className="faq-form">
                  <div className="form-group">
                    <label>Question</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter question"
                      value={newFAQ.question}
                      onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Answer</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter answer"
                      value={newFAQ.answer}
                      onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Segment</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter segment"
                      value={newFAQ.segment}
                      onChange={(e) => setNewFAQ({ ...newFAQ, segment: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="action-btn primary-btn">
                    Save FAQ
                  </button>
                </form>
              </div>

              {/* FAQ List */}
              <div className="table-section">
                <h3 className="section-title">Existing FAQs</h3>
                {isLoading ? (
                  <div className="loading-message">Loading FAQs...</div>
                ) : (
                  <div className="table-responsive">
                    <table className="participants-table">
                      <thead>
                        <tr>
                          <th>SNo.</th>
                          <th>Question</th>
                          <th>Answer</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {faqs.length > 0 ? (
                          faqs.map((f, index) => (
                            <tr key={f._id || index}>
                              <td>{index + 1}</td>
                              <td>{f.question || '-'}</td>
                              <td>{f.answer || '-'}</td>
                              <td>
                                <button 
                                  className="action-btn delete-btn"
                                  onClick={() => handleDelete(f._id)}
                                  disabled={!f._id}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="no-data">
                              No FAQs available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQManagement;