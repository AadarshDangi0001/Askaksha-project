import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Setting = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="w-full min-h-scree mt-10 bg-[#E8FDFF] overflow-y-auto pb-10">
      <div className="w-full px-8 lg:px-16 py-6 mt-20 lg:mt-6">
        <h1 className="text-3xl lg:text-4xl font-bold mb-6">Settings</h1>
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <p className="text-gray-700 mb-6">Settings page coming soon...</p>
          
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Setting