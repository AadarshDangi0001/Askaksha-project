import React, { useState, useEffect } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import { studentAPI } from '../services/api'

const StudentNav = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Demo notifications
  const notifications = [
    {
      id: 1,
      type: "announcement",
      icon: "ri-megaphone-line",
      title: "New Assignment Posted",
      message: "Data Structures Assignment 3 is now available",
      time: "2 hours ago",
      isRead: false
    },
    {
      id: 2,
      type: "reminder",
      icon: "ri-time-line",
      title: "Exam Reminder",
      message: "Mid-term exam for Mathematics on Dec 15",
      time: "5 hours ago",
      isRead: false
    },
    {
      id: 3,
      type: "success",
      icon: "ri-checkbox-circle-line",
      title: "Fee Payment Confirmed",
      message: "Your semester fee payment has been processed",
      time: "1 day ago",
      isRead: true
    },
    {
      id: 4,
      type: "info",
      icon: "ri-information-line",
      title: "Library Update",
      message: "New books added to the library catalog",
      time: "2 days ago",
      isRead: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Fetch student info on component mount
  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        // First try to get from localStorage
        const storedInfo = localStorage.getItem('studentInfo');
        if (storedInfo) {
          setStudentInfo(JSON.parse(storedInfo));
        }
        
        // Then fetch fresh data from backend
        const data = await studentAPI.getDashboard();
        const updatedInfo = {
          name: data.studentName || data.student?.name,
          email: data.student?.email,
          collegeCode: data.collegeCode,
          collegeName: data.collegeName
        };
        setStudentInfo(updatedInfo);
        localStorage.setItem('studentInfo', JSON.stringify(updatedInfo));
      } catch (error) {
        console.error('Error fetching student info:', error);
        // Keep using localStorage data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, []);
  
  // Map routes to page titles
  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/chatbot': 'Chat AI',
    '/bulletboard': 'Bulletin Board',
    '/scan-docs': 'Scan Docs',
    '/whatsapp-bot': 'WhatsApp Bot',
    '/volunteer': 'Volunteers Help',
    '/about': 'About Us',
    '/offline-bot': 'Offline Mode',
    '/agentic': 'AI Agent',
    '/settings': 'Settings'
  };
  
  // Get current page title or default to 'Dashboard'
  const currentPageTitle = pageTitles[location.pathname] || 'Dashboard';
  
  return (
    <div className='fixed top-0 left-0 lg:left-[16vw] right-0 h-20 bg-[#2a2a2a] lg:bg-transparent flex items-center justify-between px-4 lg:px-8 z-50'>
      {/* Left Side - Menu Icon (Mobile) or Page Title (Desktop) */}
      <div className='flex items-center gap-4'>
        {/* Mobile Menu Icon */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='lg:hidden text-white hover:opacity-80 transition-opacity'
        >
          <i className="ri-menu-line text-3xl"></i>
        </button>
        
        {/* Logo (Mobile) */}
        <img 
          src="/imgs/logomini.png" 
          alt="Askly" 
          className='h-12 lg:hidden'
        />
        
        {/* Page Title (Desktop) */}
        <h1 className='hidden lg:block text-2xl font-semibold text-gray-800'>~{currentPageTitle}</h1>
      </div>
      
      {/* Right Side - Notification & Profile */}
      <div className='flex items-center gap-3 lg:gap-6'>
        {/* Notification Icon */}
        <div className='relative'>
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className='relative hover:opacity-80 transition-opacity'
          >
            <i className="ri-notification-line text-2xl text-white lg:text-gray-700"></i>
            {unreadCount > 0 && (
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <>
              {/* Backdrop for mobile */}
              <div 
                className='fixed inset-0 z-40 lg:hidden'
                onClick={() => setIsNotificationOpen(false)}
              ></div>
              
              {/* Notification Panel */}
              <div className='fixed lg:absolute top-20 lg:top-full right-0 lg:right-0 mt-0 lg:mt-2 w-screen lg:w-96 bg-white lg:rounded-2xl shadow-2xl z-50 max-h-[calc(100vh-5rem)] lg:max-h-[32rem] overflow-hidden'>
                {/* Header */}
                <div className='bg-gradient-to-r from-[#3B9FFF] to-[#5FB4FF] p-4 flex items-center justify-between'>
                  <div>
                    <h3 className='text-white font-bold text-lg'>Notifications</h3>
                    <p className='text-white/80 text-sm'>{unreadCount} unread</p>
                  </div>
                  <button 
                    onClick={() => setIsNotificationOpen(false)}
                    className='text-white hover:bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center lg:hidden'
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                {/* Notifications List */}
                <div className='overflow-y-auto max-h-[calc(100vh-12rem)] lg:max-h-96'>
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className='flex gap-3'>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.type === 'announcement' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'reminder' ? 'bg-orange-100 text-orange-600' :
                          notification.type === 'success' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <i className={`${notification.icon} text-lg`}></i>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between gap-2'>
                            <h4 className='font-semibold text-gray-900 text-sm'>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <span className='w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5'></span>
                            )}
                          </div>
                          <p className='text-gray-600 text-sm mt-1 line-clamp-2'>
                            {notification.message}
                          </p>
                          <p className='text-gray-400 text-xs mt-2'>
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className='p-3 border-t border-gray-200 bg-gray-50'>
                  <button className='w-full text-center text-[#3B9FFF] font-medium text-sm hover:text-[#2b8fe8] transition-colors py-2'>
                    View All Notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* User Profile */}
        <div className='flex  items-center gap-2 lg:gap-3 bg-linear-to-r from-[#3B9FFF] to-[#5FB4FF] rounded-lg px-2 lg:px-4 py-2 cursor-pointer hover:opacity-90 transition-opacity'>
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(studentInfo?.name || 'Student')}&background=1e40af&color=fff&size=128`}
            alt="User" 
            className='w-10 h-10 rounded-full object-cover'
          />
          <div className='text-white hidden sm:block'>
            <p className='font-semibold text-sm'>
              {loading ? 'Loading...' : (studentInfo?.name || 'Student')}
            </p>
            <p className='text-xs opacity-90'>
              {studentInfo?.collegeCode || studentInfo?.email || ''}
            </p>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className='fixed inset-0  bg-opacity-50 lg:hidden z-40'
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Mobile Sidebar */}
          <div className='fixed top-0 left-0 h-screen w-64 bg-[#1a1a1a] z-50 lg:hidden overflow-y-auto transform transition-transform duration-300'>
            {/* Close Button */}
            <div className='flex justify-between items-center p-4 border-b border-gray-800'>
              <img src="/imgs/logomini.png" alt="Askly" className='h-10' />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className='text-white hover:opacity-80'
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            
            {/* Mobile Menu Content - Copy from StudentSidebar */}
            <div className='p-4'>
              <h3 className="text-gray-500 text-sm font-medium mb-3 px-3">Main</h3>
              <div className="space-y-1">
                {/* Add NavLinks here - you can import from StudentSidebar or duplicate */}
                <NavLink 
                  to="/dashboard" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400 transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  <i className="ri-dashboard-line text-l"></i>
                  <p className="text-sm font-medium">Dashboard</p>
                </NavLink>
                <NavLink 
                  to="/chatbot" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400 transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  <i className="ri-message-2-line text-l"></i>
                  <p className="text-sm font-medium">Chat AI</p>
                </NavLink>
                <NavLink 
                  to="/bulletboard" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400 transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  <i className="ri-book-open-line text-l"></i>
                  <p className="text-sm font-medium">Bulletin</p>
                </NavLink>
                <NavLink 
                  to="/scan-docs" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400 transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  <i className="ri-camera-line text-l"></i>
                  <p className="text-sm font-medium">Scan Docs</p>
                </NavLink>
                <NavLink 
                  to="/whatsapp-bot" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400 transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  <i className="ri-wechat-2-line text-l"></i>
                  <p className="text-sm font-medium">WhatsApp Bot</p>
                </NavLink>
                <NavLink 
                  to="/volunteer" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400 transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  <i className="ri-wechat-line text-l"></i>
                  <p className="text-sm font-medium">Volunteers Help</p>
                </NavLink>
                {/* <NavLink 
                  to="/offline-bot" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400 transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  <i className="ri-wifi-off-line text-l"></i>
                  <p className="text-sm font-medium">Offline Mode</p>
                </NavLink>
                <NavLink 
                  to="/agentic" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400 transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  <i className="ri-computer-line text-l"></i>
                  <p className="text-sm font-medium">AI Agent</p>
                </NavLink> */}
                <NavLink 
                  to="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400 transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  <i className="ri-notification-line text-l"></i>
                  <p className="text-sm font-medium">About Us</p>
                </NavLink>
              </div>
              
              {/* Settings */}
              <div className="mt-6 pt-4 border-t border-gray-800">
                <NavLink 
                  to="/settings" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400 transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  <i className="ri-settings-2-line text-l"></i>
                  <p className="text-sm font-medium">Settings</p>
                </NavLink>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default StudentNav
