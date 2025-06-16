import React, { useState } from 'react';
import SideNavbar from './SideNavBar';
import SideBar from './SideBar';
import { FaSearch } from 'react-icons/fa';


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDelete = (uid) => {
    if (window.confirm("Are you sure you want to delete this participant?")) {
      console.log("Deleting participant:", uid);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <div className={`side-nav-container ${isSidebarOpen ? 'open' : 'closed'}`}>
        <SideNavbar isOpen={isSidebarOpen} />
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
              <h2 className="page-title">Vanijya Utsav 2021</h2>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="search-input-group">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <FaSearch className="search-icon" />
                </button>
              </form>
              
              {/* Participants Table */}
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
                    {/* {participants.map((p, index) => (
                      <tr key={p._id}>
                        <td>{index + 1}</td>
                        <td>{p.name}</td>
                        <td>{p.phone}</td>
                        <td>{p.email}</td>
                        <td>{p.designation}</td>
                        <td>{p.name_of_org}</td>
                        <td>{p.consent}</td>
                        <td> */}
                          {/* <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(p._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr> */}
                    {/* ))} */}
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

export default Dashboard;