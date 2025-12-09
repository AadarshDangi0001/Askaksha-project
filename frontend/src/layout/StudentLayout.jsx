import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar.jsx'
import StudentNav from '../components/StudentNav.jsx'
import EmbeddedChatbot from '../components/EmbeddedChatbot.jsx'

const StudentLayout = () => {
  const location = useLocation();
  
  // Don't show embedded chatbot on these pages
  const hideChatbotPaths = ['/student/chatbot'];
  const showChatbot = !hideChatbotPaths.includes(location.pathname);

  return (
    <div className='flex relative'>
      <StudentSidebar/>
      <StudentNav/>
      <div className="studentsidelayout ml-0 lg:ml-[17vw] w-full">
        <Outlet />
      </div>
      {showChatbot && <EmbeddedChatbot />}
    </div>
  )
}

export default StudentLayout
