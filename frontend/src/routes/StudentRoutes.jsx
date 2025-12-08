import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import StudentLayout from '../layout/StudentLayout'
import DashboardPage from '../pages/students/DashboardPage'
import ChatbotPage from '../pages/students/ChatbotPage'
import BulletboardPage from '../pages/students/BulletboardPage'
import ScanDocs from '../pages/students/ScanDocs'
import WhatsappbotPage from '../pages/students/WhatsappbotPage'
import VolunteerPage from '../pages/students/VolunteerPage'
import AboutPage from '../pages/students/AboutPage'
import OfflinebotPage from '../pages/students/OfflinebotPage'
import AgenticPage from '../pages/students/AgenticPage'
import Setting from '../pages/students/Setting'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

const StudentRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      
      {/* Protected Student Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <StudentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="chatbot" element={<ChatbotPage />} />
        <Route path="bulletboard" element={<BulletboardPage />} />
        <Route path="scan-docs" element={<ScanDocs />} />
        <Route path="whatsapp-bot" element={<WhatsappbotPage />} />
        <Route path="volunteer" element={<VolunteerPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="offline-bot" element={<OfflinebotPage />} />
        <Route path="agentic" element={<AgenticPage />} />
        <Route path="settings" element={<Setting />} />
      </Route>
    </Routes>
  )
}

export default StudentRoutes