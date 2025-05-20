import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../layouts/MetaData";

const AdminPanel = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Fragment>
      <MetaData title={"Admin Panel"} />

      <div className="admin-panel">
        <h1>Admin Panel</h1>
        <div className="admin-options">
          <div
            className="admin-op"
            onClick={() => handleNavigation("/admin-panel/users")}
          >
            <div>
              <img src="/images/user2.svg" alt="user" />
            </div>
            <p>Manage Users</p>
          </div>

          <div
            className="admin-op"
            onClick={() => handleNavigation("/admin-panel/books")}
          >
            <div>
              <img src="/images/book.svg" alt="books" />
            </div>
            <p>Manage Books</p>
          </div>

          <div
            className="admin-op"
            onClick={() => handleNavigation("/admin-panel/exams")}
          >
            <div>
              <img src="/images/administrator-developer-icon.svg" alt="exams" />
            </div>
            <p>Manage Exams</p>
          </div>

          <div
            className="admin-op"
            onClick={() => handleNavigation("/admin-panel/reports")}
          >
            <div>
              <img src="/images/report.svg" alt="reports" />
            </div>
            <p>View Reports</p>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <h2>Admin Content</h2>
        <p>This is where you can manage the application.</p>
        <p>More features will be added soon!</p>
      </div>
    </Fragment>
  );
};

export default AdminPanel;
