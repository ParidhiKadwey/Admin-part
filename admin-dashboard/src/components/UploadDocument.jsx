import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavBar from './SideNavBar';
import SideBar from './SideBar';
import axios from "axios";
import  API_URL  from "../services/apiConfig"; // make sure apiConfig exports it like: export const API_URL = "..."

const DocumentUploadComponent = () => {
  const [countries, setCountries] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    source: '',
    document_type: 'Universal Document',
    specimen_type: 'Import',
    description: '',
    document: null
  });
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [tagData, setTagData] = useState({
    import_country: '',
    export_country: '',
    manufacture_country: '',
    mode_of_transport: '0',
    document_specific: '0',
    tab: '0'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchDocument = async () => {
    try {
      const res = await axios.get(`${API_URL}/document`);
      console.log(res.data)
      if (res.data.success) {
        setDocuments(res.data.docs);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to load documents.");
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      setCountries([
        { value: '1', name: 'Country 1' },
        { value: '2', name: 'Country 2' }
      ]);
      await fetchDocument();
      setIsLoading(false);
    };
    init();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      document: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await axios.post(`${API_URL}/document/create`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        alert('Document uploaded successfully!');
        setFormData({
          name: '',
          source: '',
          document_type: 'Universal Document',
          specimen_type: 'Import',
          description: '',
          document: null
        });
        fetchDocument();
      } else {
        alert('Upload failed.');
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong while uploading.");
    }
  };

  const handleTagInputChange = (e) => {
    const { name, value } = e.target;
    setTagData({
      ...tagData,
      [name]: value
    });
  };

  const handleTagSubmit = async (e, docId) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/document/tag/${docId}`, tagData);
      if (response.data.success) {
        alert("Tag saved successfully!");
        setSelectedDocId(null);
        setTagData({
          import_country: '',
          export_country: '',
          manufacture_country: '',
          mode_of_transport: '0',
          document_specific: '0',
          tab: '0'
        });
      } else {
        alert("Tag saving failed.");
      }
    } catch (error) {
      console.error("Tag submit error:", error);
      alert("Failed to save tag.");
    }
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
            {/* Upload Form */}
            <div className="content-card">
              <div className="card-header">
                <h2 className="page-title">Document Upload</h2>
              </div>
              <div className="card-body">
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>

                    <div className="form-group">
                      <label>Source</label>
                      <input type="text" className="form-control" name="source" value={formData.source} onChange={handleInputChange} required />
                    </div>

                    <div className="form-group">
                      <label>Document Type</label>
                      <select className="form-control" name="document_type" value={formData.document_type} onChange={handleInputChange}>
                        <option value="Universal Document">Universal Document</option>
                        <option value="Country Level Document">Country Level Document</option>
                        <option value="Product Level Document">Product Level Document</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Specimen Type</label>
                      <select className="form-control" name="specimen_type" value={formData.specimen_type} onChange={handleInputChange}>
                        <option value="Import">Import</option>
                        <option value="Export">Export</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Upload File (PDF only)</label>
                      <input type="file" className="form-control" name="document" accept=".pdf" onChange={handleFileChange} required />
                      {formData.document && <small>Selected: {formData.document.name}</small>}
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} rows="3"></textarea>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="action-btn primary-btn">Save Document</button>
                  </div>
                </form>
              </div>
            </div>

            {/* Documents Table */}
            <div className="content-card">
              <div className="card-header">
                <h2 className="page-title">Uploaded Documents</h2>
                <div className="total-items">{documents?.length || 0} documents found</div>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <div className="loading-spinner">Loading...</div>
                ) : error ? (
                  <div className="error-message">{error}</div>
                ) : (
                  <div className="table-section">
                    <div className="table-card">
                      <div className="table-responsive">
                        <table className="participants-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Description</th>
                              <th>Source</th>
                              <th>Document Type</th>
                              <th>File</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(documents) && documents.length > 0 ? (
                              documents.map(doc => (
                                <tr key={doc._id || Math.random()}>
                                  <td>{doc.name || '-'}</td>
                                  <td>
                                    {doc.description && (
                                      <button className="action-btn view-btn" onClick={() => setSelectedDocId(doc._id)}>
                                        View Description
                                      </button>
                                    )}
                                  </td>
                                  <td>{doc.source || '-'}</td>
                                  <td>{doc.document_type || '-'}</td>
                                  <td>{doc.filename || '-'}</td>
                                  <td>
                                    <button className="action-btn primary-btn" onClick={() => setSelectedDocId(doc._id)}>
                                      Tag Document
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6" className="no-data">No documents found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tag Modal */}
      {selectedDocId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Tag Document</h3>
              <button className="close-modal-btn" onClick={() => setSelectedDocId(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => handleTagSubmit(e, selectedDocId)}>
                <div className="form-grid">
                  {['import_country', 'export_country', 'manufacture_country'].map((field) => (
                    <div className="form-group" key={field}>
                      <label>{field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                      <select className="form-control" name={field} value={tagData[field]} onChange={handleTagInputChange}>
                        <option value="">Select Country</option>
                        {countries.map(country => (
                          <option key={country.value} value={country.value}>{country.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <div className="form-group">
                    <label>Mode of Transport</label>
                    <select className="form-control" name="mode_of_transport" value={tagData.mode_of_transport} onChange={handleTagInputChange}>
                      <option value="0">All</option>
                      <option value="1">Air</option>
                      <option value="2">Sea</option>
                      <option value="3">Land</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Document Specific</label>
                    <select className="form-control" name="document_specific" value={tagData.document_specific} onChange={handleTagInputChange}>
                      <option value="0">All</option>
                      <option value="1">Country Specific</option>
                      <option value="2">Country and Product Specific</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Select Tab</label>
                    <select className="form-control" name="tab" value={tagData.tab} onChange={handleTagInputChange}>
                      <option value="0">All</option>
                      <option value="1">Import Control</option>
                      <option value="2">Export Control</option>
                      <option value="3">Labelling Rules</option>
                      <option value="4">Standards</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="action-btn primary-btn">Save Tags</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploadComponent;
