import React, { useState, useEffect } from "react";
import SideNavBar from './SideNavBar';
import SideBar from'./SideBar'; 
const PermissionManagement = () => {
  const [permissions, setPermissions] = useState({
    export_document: false,
    import_document: false,
    currency_converter: false,
    hs_code: false,
    container_stuffing: false,
    view_profile: false
  });
  const token = sessionStorage.getItem("usertoken");

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const response = await fetch("http://api.mptradeportal.org/user/permissions", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setPermissions(data || {});
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    }
    fetchPermissions();
  }, [token]);

  const handleToggle = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUpdatePermissions = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://api.mptradeportal.org/user/updatePermissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(permissions)
      });
      alert("Permissions Updated!");
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-8 offset-2">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="text-center">Set Permissions</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdatePermissions}>
                <div className="row">
                  {Object.keys(permissions).map((key) => (
                    <div className="form-group col-6" key={key}>
                      <label className="mt-2">{key.replace("_", " ")}</label>
                      <div className="checkbox">
                        <input
                          type="checkbox"
                          checked={permissions[key]}
                          onChange={() => handleToggle(key)}
                          data-toggle="toggle"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="form-group col-12">
                    <input type="submit" className="btn btn-danger" value="Update" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionManagement;