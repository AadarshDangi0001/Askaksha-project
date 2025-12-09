import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import AdminNav from '../components/AdminNav'

const AdminLayout = ({ children }) => {
  return (
    <div className='flex relative'>
      <AdminSidebar />
      <AdminNav />
      <div className="adminlayout ml-0 lg:ml-[17vw] w-full">
        {children || <Outlet />}
      </div>
    </div>
  )
}

export default AdminLayout
