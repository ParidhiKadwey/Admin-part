

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaUserTie, 
  FaIndustry, 
  FaUserShield,
  FaShip,
  FaSearch,
  FaQuestionCircle,
  FaNewspaper,
  FaEnvelope,
  FaChartLine,
  FaUpload,
  FaCalendarAlt,
  FaSignOutAlt,
  FaAngleRight,
  FaChevronDown,
  FaChevronRight
} from "react-icons/fa";

const SideNavbar = ({ isOpen }) => {
  const navigate = useNavigate();
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);

  const toggleUserDetails = () => {
    setIsUserDetailsOpen(!isUserDetailsOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h3 className="text-center">Admin</h3>
        <p className="text-center">MP Trade Portal</p>
      </div>

      <nav className="sidebar-nav">
        <section className="nav-section">
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            <li>
              <button 
                className="nav-item" 
                onClick={() => handleNavigation("/dashboard")}
              >
                <FaTachometerAlt className="nav-icon" />
                {isOpen && <span>Dashboard</span>}
              </button>
            </li>
            
            {/* Get User Details Dropdown */}
            <li className={`dropdown ${isUserDetailsOpen ? 'open' : ''}`}>
              <button 
                className="nav-item" 
                onClick={toggleUserDetails}
              >
                <FaUsers className="nav-icon" />
                {isOpen && (
                  <>
                    <span className="nav-text" style={{ paddingRight: '4px' }}>Get User Details</span>
                    {isUserDetailsOpen ? 
                      <FaChevronDown className="dropdown-arrow" /> : 
                      <FaChevronRight className="dropdown-arrow" />
                    }
                  </>
                )}
              </button>
              
              {isUserDetailsOpen && isOpen && (
                <ul className="sub-menu">
                  <li>
                    <button 
                      className="custom-btn" 
                      onClick={() => navigate("/AdminList")}
                    >
                      <FaAngleRight className="mr-2" />
                      <span>Admin</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      className="custom-btn" 
                      onClick={() => navigate("/VendorList")}
                    >
                      <FaAngleRight className="mr-2" />
                      <span>Vendor / Dealer</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      className="custom-btn" 
                      onClick={() => navigate("/SellerList")}
                    >
                      <FaAngleRight className="mr-2" />
                      <span>Seller / Manufacturer</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      className="custom-btn" 
                      onClick={() => navigate("/CustomerAgentList")}
                    >
                      <FaAngleRight className="mr-2" />
                      <span>Custom House Agent</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      className="custom-btn" 
                      onClick={() => navigate("/ForwarderList")}
                    >
                      <FaAngleRight className="mr-2" />
                      <span>Freight Forwarder</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      className="custom-btn" 
                      onClick={() => navigate("/VesselList")}
                    >
                      <FaAngleRight className="mr-2" />
                      <span>Vessel</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Other menu items */}
            <li>
              <button 
                className="nav-item" 
                onClick={() => handleNavigation("/HSCode")}
              >
                <FaSearch className="nav-icon" />
                {isOpen && <span>HS Code</span>}
              </button>
            </li>
            <li>
              <button className="nav-item" onClick={() => handleNavigation("/faq")}>
                <span className="icon"><FaQuestionCircle /></span>
                <span>FAQ</span>
              </button>
            </li>
            <li>
              <button className="nav-item" onClick={() => handleNavigation("/PRRealease")}>
                <span className="icon"><FaNewspaper /></span>
                <span>Press Release</span>
              </button>
            </li> 
            <li>
              <button className="nav-item" onClick={() => handleNavigation("/ContactUs")}>
                <span className="icon"><FaEnvelope /></span>
                <span>Connection Request</span>
              </button>
            </li>
            <li>
              <button className="nav-item" onClick={() => handleNavigation("/MarketInformation")}>
                <span className="icon"><FaChartLine /></span>
                <span>Market Info</span>
              </button>
            </li>
            <li>
              <button className="nav-item" onClick={() => handleNavigation("/UploadDocument")}>
                <span className="icon"><FaUpload /></span>
                <span>Document Upload</span>
              </button>
            </li>
            <li>
              <button className="nav-item" onClick={() => handleNavigation("/Meetings")}>
                <span className="icon"><FaCalendarAlt /></span>
                <span>Meetings</span>
              </button>
            </li>
            <li>
              <button className="nav-item" onClick={() => handleNavigation("/Homepage")}>
                <span className="icon"><FaSignOutAlt /></span>
                <span>Logout</span>
              </button>
            </li>
           
          </ul>
        </section>
      </nav>
    </div>
  );
};

export default SideNavbar;