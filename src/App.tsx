import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BookingModalProvider } from './context/BookingModalContext'
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
import NotFound from './pages/NotFound'
import AdminGuard from './components/admin/AdminGuard'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminServices from './pages/admin/AdminServices'
import AdminBookings from './pages/admin/AdminBookings'
import AdminReviews from './pages/admin/AdminReviews'
import AdminVerifications from './pages/admin/AdminVerifications'
import AdminContacts from './pages/admin/AdminContacts'
import AdminWaitlist from './pages/admin/AdminWaitlist'
import AdminNotifications from './pages/admin/AdminNotifications'

function App() {
  return (
    <AuthProvider>
    <BookingModalProvider>
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

            <Route element={<AdminGuard />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/services" element={<AdminServices />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/reviews" element={<AdminReviews />} />
                <Route path="/admin/verifications" element={<AdminVerifications />} />
                <Route path="/admin/contacts" element={<AdminContacts />} />
                <Route path="/admin/waitlist" element={<AdminWaitlist />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
    </BookingModalProvider>
    </AuthProvider>
  )
}

export default App
