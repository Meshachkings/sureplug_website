import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import About from './pages/About'
import Contact from './pages/Contact'
import Taskers from './pages/Taskers'
import TaskerDetail from './pages/TaskerDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOtp from './pages/VerifyOtp'
import ResetPassword from './pages/ResetPassword'
import BecomeProvider from './pages/BecomeProvider'

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="app">
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/taskers" element={<Taskers />} />
            <Route path="/taskers/:id" element={<TaskerDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/become-a-provider" element={<BecomeProvider />} />
          </Routes>
        </main>
      </div>
    </Router>
    </AuthProvider>
  )
}

export default App
