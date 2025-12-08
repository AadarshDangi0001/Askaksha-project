import React from 'react'
import { Outlet } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar.jsx'
import StudentNav from '../components/StudentNav.jsx'

const StudentLayout = () => {
  return (
    <div className='flex relative'>
      <StudentSidebar/>
      <StudentNav/>
      <div className="studentsidelayout ml-0 lg:ml-[17vw] w-full">
        <Outlet />
      </div>
    </div>
  )
}

export default StudentLayout
