import React, { useEffect, useState } from "react";
import SideNavBar from './SideNavBar';
import SideBar from './SideBar';
import axios from "axios";
import API_URL from "../services/apiConfig";
import './hsCode.css'

const HSCodeManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hsCodes, setHsCodes] = useState([]);
  const [newHSCode, setNewHSCode] = useState({ code: "", detail: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // for dropdown

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const AllHSCODE = async (page = 1, limit = itemsPerPage) => {
    try {
      const res = await axios.get(`${API_URL}/hscode/all?page=${page}&limit=${limit}`);
      if (res.data.success) {
        setHsCodes(res.data.docs);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage);
      }
    } catch (error) {
      console.log("Error fetching HS Codes:", error);
    }
  };

  useEffect(() => {
    AllHSCODE(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handleAddHSCode = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: newHSCode.code,
        detail: newHSCode.detail
      };

      const response = await axios.post(`${API_URL}/hscode/new`, payload);

      if (response.data.success) {
        setNewHSCode({ code: "", detail: "" });
        AllHSCODE(currentPage, itemsPerPage); // reload current page
      }
    } catch (error) {
      console.error("Error adding HS Code:", error);
    }
  };

  const handlePageSizeChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page on change
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };



  const handleDelete = async(id)=>{
    // e.preventDefault()
    try {
      const res = await axios.delete(`${API_URL}/hscode/${id}`);
      console.log(res.data)
      if(res.data.success){
         setHsCodes((prevHsCodes) => prevHsCodes.filter(hs => hs._id !== id));
      }
    } catch (error) {
      console.log(error)

    }

  }



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
              <h2 className="page-title">HS Code Management</h2>

              <div className="hs-code-content">
                {/* Add Form */}
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

                {/* Table with HS Codes */}
                <div className="table-section">
                  <div className="table-card">
                    <div className="d-flex justify-between align-items-center mb-3">
                      <h3 className="section-title">Existing HS Codes</h3>

                      {/* Page Size Selector */}
                      <div className="page-size-control">
                        <label>Items per page: </label>
                        <select value={itemsPerPage} onChange={handlePageSizeChange}>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="participants-table">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hsCodes.length > 0 ? (
                            hsCodes.map((hsCode, index) => (
                              <tr key={index}>
                                <td>{hsCode.code}</td>
                                <td>{hsCode.name}</td>
                                <td>
                                  <button onClick={()=>{
                                    handleDelete(hsCode._id)
                                  }} className="action-btn delete-btn">
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

               <div className="pagination">
      <button onClick={handlePrev} disabled={currentPage === 1} className="pagination-btn">
    Previous
       </button>

  {/* Always show first 3 pages */}
  {[1, 2, 3].map((page) =>
    page <= totalPages ? (
      <button
        key={page}
        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    ) : null
  )}

  {/* Show ... if more than 4 pages */}
  {totalPages > 5 && currentPage > 4 && <span className="pagination-ellipsis">...</span>}

  {/* Show current page if it's not among first/last 3 */}
  {currentPage > 3 && currentPage < totalPages - 2 && (
    <button className="pagination-btn active" disabled>
      {currentPage}
    </button>
  )}

  {/* Show ... if we skipped to end */}
  {totalPages > 5 && currentPage < totalPages - 3 && <span className="pagination-ellipsis">...</span>}

  {/* Always show last 2 pages */}
  {[totalPages - 1, totalPages].map((page) =>
    page > 3 ? (
      <button
        key={page}
        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    ) : null
  )}

  <button onClick={handleNext} disabled={currentPage === totalPages} className="pagination-btn">
    Next
  </button>
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
};

export default HSCodeManagement;
