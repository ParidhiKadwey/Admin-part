
import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const SideBar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className="top-sidebar-container">
      <button 
        className="header-menu-btn" 
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? <FaBars /> : <FaBars />}
      </button>
      {/* Other top navigation content */}
    </div>
  );
};

export default SideBar;