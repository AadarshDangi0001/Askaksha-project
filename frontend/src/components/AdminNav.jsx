import React, { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";

const AdminNav = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pageTitles = {
    "/admin-dashboard": "Dashboard",
    "/admin-bulletboard": "Bulletin Board",
    "/assign-volunteers": "Assign Volunteers",
    "/upgrade-data": "Upgrade Data",
    "/about": "About Us",
    "/settings": "Settings",
    "/embedded-bot": "Embedded Bot",
    "/student-logs": "Student Logs",
  };

  const currentPageTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="fixed top-0 left-0 lg:left-[16vw] right-0 h-20 bg-[#E8FDFF] shadow-md flex items-center justify-between px-4 lg:px-8 z-50 transition-all">

      {/* Left Area */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-gray-800 hover:opacity-80 transition-opacity"
        >
          <i className="ri-menu-line text-3xl"></i>
        </button>

        {/* Logo (Mobile Only) */}
        <img src="/imgs/logomini.png" alt="Askly" className="h-12 lg:hidden" />

        {/* Page Title */}
        <h1 className="hidden lg:block text-2xl font-semibold text-gray-800">
          ~{currentPageTitle}
        </h1>
      </div>

      {/* Right Area */}
      <div className="flex items-center gap-3 lg:gap-6">

        {/* Notification Icon */}
        <button className="relative hover:opacity-80 transition-opacity">
          <i className="ri-notification-line text-2xl text-gray-800"></i>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 lg:gap-3 bg-blue-500 rounded-lg px-2 lg:px-4 py-2 cursor-pointer hover:opacity-90 transition-opacity">
          <img
            src="/imgs/user-avatar.jpg"
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://ui-avatars.com/api/?name=Aadarsh&background=1e40af&color=fff&size=128";
            }}
          />
          <div className="text-white hidden sm:block">
            <p className="font-semibold text-sm">Aadarsh dangi</p>
            <p className="text-xs opacity-90">1023CS231001</p>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Sidebar Panel */}
          <div className="fixed top-0 left-0 h-screen w-64 bg-[#1a1a1a] z-50 lg:hidden overflow-y-auto transition-transform duration-300">

            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <img src="/imgs/logomini.png" alt="Askly" className="h-10" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:opacity-80"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4">

              <h3 className="text-gray-500 text-sm font-medium mb-3 px-3">Main</h3>

              <div className="space-y-1">
                {[
                  { label: "Dashboard", icon: "ri-dashboard-line", link: "/admin-dashboard" },
                  { label: "Bulletin Board", icon: "ri-book-open-line", link: "/admin-bulletboard" },
                  { label: "Assign Volunteers", icon: "ri-team-line", link: "/assign-volunteers" },
                  { label: "Upgrade Data", icon: "ri-upload-cloud-2-line", link: "/upgrade-data" },
                  { label: "Student Logs", icon: "ri-wifi-off-line", link: "/student-logs" },
                  { label: "WhatsApp Bot", icon: "ri-whatsapp-line", link: "/admin-whatsapp-bot" },
                  { label: "Embedded Bot", icon: "ri-wechat-2-line", link: "/embedded-bot" },
                  { label: "About Us", icon: "ri-information-line", link: "/about" },
                ].map((nav, index) => (
                  <NavLink
                    key={index}
                    to={nav.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400 transition-colors ${
                        isActive ? "bg-blue-500 text-white" : ""
                      }`
                    }
                  >
                    <i className={`${nav.icon} text-lg`}></i>
                    <p className="text-sm font-medium">{nav.label}</p>
                  </NavLink>
                ))}
              </div>

              {/* Settings */}
              <div className="mt-6 pt-4 border-t border-gray-800">
                <NavLink
                  to="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400 transition-colors ${
                      isActive ? "bg-blue-500 text-white" : ""
                    }`
                  }
                >
                  <i className="ri-settings-2-line text-lg"></i>
                  <p className="text-sm font-medium">Settings</p>
                </NavLink>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminNav;
