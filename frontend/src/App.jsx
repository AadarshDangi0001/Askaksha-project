
import { AuthProvider } from './context/AuthContext'
import StudentRoutes from './routes/StudentRoutes.jsx'

function App() {
  return (
    <AuthProvider>
      <StudentRoutes/>
    </AuthProvider>
  )
}

export default App
