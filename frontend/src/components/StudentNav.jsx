import React, { useState } from 'react'
import { useLocation, NavLink } from 'react-router-dom'

const StudentNav = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
        <button className='relative hover:opacity-80 transition-opacity'>
          <i className="ri-notification-line text-2xl text-white lg:text-gray-700"></i>
        </button>
        
        {/* User Profile */}
        <div className='flex  items-center gap-2 lg:gap-3 bg-linear-to-r from-[#3B9FFF] to-[#5FB4FF] rounded-lg px-2 lg:px-4 py-2 cursor-pointer hover:opacity-90 transition-opacity'>
          <img 
            src="/imgs/user-avatar.jpg" 
            alt="User" 
            className='w-10 h-10 rounded-full object-cover'
            onError={(e) => {
              e.target.src = 'https://ui-avatars.com/api/?name=Aadarsh&background=1e40af&color=fff&size=128'
            }}
          />
          <div className='text-white hidden sm:block'>
            <p className='font-semibold text-sm'>Aadarsh dangi</p>
            <p className='text-xs opacity-90'>1023CS231001</p>
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
                <NavLink 
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
                </NavLink>
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
