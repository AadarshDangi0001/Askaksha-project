
import { AuthProvider } from './context/AuthContext'
import StudentRoutes from './routes/StudentRoutes.jsx'
import AdminRoutes from './routes/AdminRoutes.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import ChatbotDemo from './pages/ChatbotDemo.jsx'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chatbot-demo" element={<ChatbotDemo />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/student/*" element={<StudentRoutes />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
