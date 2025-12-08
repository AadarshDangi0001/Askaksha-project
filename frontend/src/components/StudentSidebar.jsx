import React from 'react'
import { NavLink } from 'react-router-dom'

const StudentSidebar = () => {
  return (
    <div className='h-screen z-100 fixed w-[17vw] bg-[#1a1a1a] flex-col px-4 py-0 overflow-y-auto hidden lg:flex'>
       {/* Logo */}
       <div className="mb-0 sticky top-0 bg-[#1a1a1a] z-10">
         <img src="/imgs/asklylogo_main.png" alt="Askly" className="w-full px-2" />
       </div>

       {/* Main Section */}
       <div className="flex-1">
         <div className="mb-6">
           <h3 className="text-gray-500 text-sm font-medium mb-3 px-3">Main</h3>
           <div className="space-y-1">
             <NavLink 
               to="/dashboard"
               className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400 transition-colors  ${isActive ? 'bg-blue-500  text-white hover:bg-blue-600' : ''}`}
             >
               <i className="ri-dashboard-line text-l"></i>
               <p className="text-[1.5vh] font-medium">Dashboard</p>
             </NavLink>

             <NavLink 
               to="/chatbot"
               className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400  transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
             >
               <i className="ri-message-2-line text-l"></i>
               <p className="text-[1.5vh] font-medium">Chat AI</p>
             </NavLink>

             <NavLink 
               to="/bulletboard"
               className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400  transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
             >
               <i className="ri-book-open-line text-l"></i>
               <p className="text-[1.5vh] font-medium">Bulletin</p>
             </NavLink>

             <NavLink 
               to="/scan-docs"
               className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400  transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
             >
               <i className="ri-camera-line text-l"></i>
               <p className="text-[1.5vh] font-medium">Scan Docs</p>
             </NavLink>

             <NavLink 
               to="/whatsapp-bot"
               className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400  transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
             >
               <i className="ri-wechat-2-line text-l"></i>
               <p className="text-[1.5vh] font-medium">WhatsApp Bot</p>
             </NavLink>

             <NavLink 
               to="/volunteer"
               className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400  transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
             >
               <i className="ri-wechat-line text-l"></i>
               <p className="text-[1.5vh] font-medium">Volunteers Help</p>
             </NavLink>

             

             <NavLink 
               to="/offline-bot"
               className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400  transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
             >
               <i className="ri-wifi-off-line text-l"></i>
               <p className="text-[1.5vh] font-medium">Offline Mode</p>
             </NavLink>
           </div>
           <div className="space-y-1">
             <NavLink 
               to="/agentic"
               className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400  transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
             >
               <i className="ri-computer-line text-l"></i>
               <p className="text-[1.5vh] font-medium">AI Agent</p>
             </NavLink>

             <NavLink 
               to="/about"
               className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400  transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
             >
               <i className="ri-notification-line text-l"></i>
               <p className="text-[1.5vh] font-medium">About Us</p>
             </NavLink>
           </div>
         </div>

        
        
       </div>

       {/* Settings at Bottom */}
       <div className="mt-auto pt-4 mb-4 border-t border-gray-800">
         <NavLink 
           to="/settings"
           className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-400  transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
         >
           <i className="ri-settings-2-line text-l"></i>
           <p className="text-[1.5vh] font-medium">Settings</p>
         </NavLink>
       </div>
    </div>
  )
}

export default StudentSidebar
