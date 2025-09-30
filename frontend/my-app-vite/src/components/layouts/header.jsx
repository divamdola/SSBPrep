import React, { Fragment, useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../App.css";
import { logout } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuRef = useRef(null);
  const sidebarRef = useRef(null);

const logoutHandler = async () => {
  try {
    await dispatch(logout()); // wait for logout to complete
    toast.success("Logged out successfully! 👋");
    navigate("/"); // redirect after logout
  } catch (error) {
    toast.error("Logout failed. Please try again.");
  }
};


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Fragment>
      <div className="header">
        {/* Menu button - hide for admin */}
        {user?.role !== "admin" && (
          <div className="menu">
            <button id="menu" onClick={() => setSidebarOpen(true)}>
              <img src="/images/menu.svg" alt="menu" />
            </button>
          </div>
        )}

        {/* Logo */}
        <div className="logo">
          <Link to={user?.role === "admin" ? "/admin-panel" : "/"}>
            <img src="/images/logo.svg" alt="logo" />
          </Link>
        </div>

        {/* Navbar - hide for admin */}
        {user?.role !== "admin" && (
          <div className="main-nav">
            <div className="navbar">
              <Link to="/">Home</Link>
              <Link to="/study-material">Study Material</Link>
              <Link to="/hall-of-achiver">Hall of Achievers</Link>
              <Link to="/about">About</Link>
            </div>
          </div>
        )}

        {/* Sidebar - hide for admin */}
        {user?.role !== "admin" && (
          <div
            className={`sidebar ${sidebarOpen ? "active" : ""}`}
            ref={sidebarRef}
          >
            <button id="cancel" onClick={() => setSidebarOpen(false)}>
              <img src="/images/cancel.svg" alt="cancel" />
            </button>
            <Link to="/">Home</Link>
            <Link to="/study-material">Study Material</Link>
            <Link to="/hall-of-achiver">Hall of Achievers</Link>
            <Link to="/about">About</Link>
          </div>
        )}

        {/* Login/User Section */}
        <div className="login-header">
          {loading && !user ? (
            <p>Loading...</p>
          ) : user ? (
            <div className="user-menu" ref={menuRef}>
              <button
                className="user-button"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <img src="/images/user.svg" alt="user" />
              </button>

              {isOpen && (
                <div className="submenu">
                  <Link to="/me">User Profile</Link>
                  <button onClick={logoutHandler} className="logout-button">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Header;
