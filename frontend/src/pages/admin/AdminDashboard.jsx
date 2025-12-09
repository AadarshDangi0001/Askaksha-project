import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import "../../styles/admindashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedAdminInfo = localStorage.getItem("adminInfo");

    if (!token || !storedAdminInfo) {
      navigate("/login");
      return;
    }

    const fetchAdminProfile = async () => {
      try {
        const parsedAdminInfo = JSON.parse(storedAdminInfo);
        console.log("Admin Info from localStorage:", parsedAdminInfo);
        
        // If collegeCode is missing, fetch from backend
        if (!parsedAdminInfo.collegeCode) {
          const data = await adminAPI.getProfile();
          console.log("Admin Info from API:", data);
          const updatedAdminInfo = data; // Backend returns admin data directly
          localStorage.setItem("adminInfo", JSON.stringify(updatedAdminInfo));
          setAdminInfo(updatedAdminInfo);
        } else {
          setAdminInfo(parsedAdminInfo);
        }
      } catch (error) {
        console.error("Error loading admin info:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminInfo");
    navigate("/login");
  };

  const handleCopyCode = () => {
    if (adminInfo?.collegeCode) {
      navigator.clipboard.writeText(adminInfo.collegeCode);
      alert("College code copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-main">
      <div className="admin-dashboard-container">
        <header className="admin-dashboard-header">
          <div className="admin-dashboard-logo">
            <img src="/imgs/LoginLogo.png" alt="Logo" />
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="admin-dashboard-content">
          <div className="admin-welcome-section">
            <h1>Welcome, Admin!</h1>
            <p className="admin-email">{adminInfo?.email}</p>
          </div>

          <div className="admin-college-code-section">
            <div className="college-code-card">
              <div className="college-code-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  width="48"
                  height="48"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                  />
                </svg>
              </div>
              <h2>Your College Code</h2>
              <div className="college-code-display">
                <span className="college-code-text">{adminInfo?.collegeCode}</span>
              </div>
              <p className="college-code-description">
                Share this code with students to allow them to register and access your college's chatbot services.
              </p>
              <button className="copy-code-btn" onClick={handleCopyCode}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
                Copy Code
              </button>
            </div>
          </div>

          <div className="admin-info-section">
            <div className="info-card">
              <h3>Admin Information</h3>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{adminInfo?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">College Code:</span>
                <span className="info-value">{adminInfo?.collegeCode}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Account ID:</span>
                <span className="info-value">{adminInfo?.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
