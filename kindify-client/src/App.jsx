import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import Home from './pages/Home/Home';
import Headers from './components/Auth/Header';
import DonorDashboard from './pages/Dashboard/donor.dashborad';
import {
  ContactAndHelpComponent,
  DonorAccountContent,
  DonorDashboardContent,
  DonorDonations,
  DonorFollowedNGOs,
  DonorNotifications,
  DonorSettingsContent,
  DonorSignupComponent, LogoutComponent,
  NGOSettingsContent,
  // Admin Components
  AdminDashboardContent,
  AdminNGOModeration,
  AdminUsers,
  AdminReports,
  AdminNotifications
} from './components';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing/Landing';
import CTAPage from './pages/CTA';
import NGODashboard from './pages/Dashboard/ngo.dashboard';
import AdminDashboard from './pages/Dashboard/admin.dashboard';
import Index from './components/InputComponent';
import {
  NGODashboardContent,
  CampaignsNGO,
  DonationsNGO,
  ImpactReportsNGO,
  MessagesNGO,
  WithdrawalsNGO,
  NotificationsNGO
} from './components';
import DonorHome from './pages/Home/DonorHome';
import NGOHome from './pages/Home/NGOHome';

// Google OAuth Client ID - Replace with your actual Google OAuth Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
import SignupForm from './pages/SignupPage/signup.jsx';
import NgoSingupComponent from './components/SignupForm/ngo.signup.component';
import LoginPageForm from './pages/LoginPage/login.page.jsx';
import authService from './services/auth.service.js';
import { useState, useEffect } from 'react';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  // const { isAuthenticated, loading } = useAuth();

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


   useEffect(() => {
        const fetchUser = async () => {
            try {
                // const token = localStorage.getItem("token");
                // if (!token) {
                //     set                // ...existing code...
                if (loading) {
                  return <div>Loading...</div>;
                }
                
                if (error) {
                  return <div>Error: {error}</div>;
                }
                
                if (!user) {
                  return <Navigate to="/login" />;
                }
                // ...existing code...(false);
                //     return;
                // }
                const data = await authService.getUserProfile();
                setUser(data);
            }catch (err) {
                console.error("Error fetching user profile:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppContent() {
  return (
    <Routes>

      {/* <Route path="/login" element={<Login />} /> */}
      {/* <Route path="/ngo-registration" element={<Index />} /> */}


      {/* donor dashboard routing */}
      <Route path="/donor-dashboard" element={<DonorDashboard />} >
        <Route path='setting' element={<DonorSettingsContent />} />
        <Route path='dashboard' element={<DonorDashboardContent />} />
        <Route path='account' element={<DonorAccountContent />} />
        <Route path='donations' element={<DonorDonations />} />
        <Route path='notifications' element={<DonorNotifications />} />
        <Route path='followed-ngos' element={<DonorFollowedNGOs />} />
        <Route path='contact&help' element={<ContactAndHelpComponent />} />
        <Route path='logout' element={<LogoutComponent />} />
      </Route>

      {/* NGO dashboard routing */}
      <Route path="/ngo-dashboard" element={<NGODashboard />} >
        <Route path='dashboard' element={<NGODashboardContent />} />
        <Route path='campaigns' element={<CampaignsNGO />} />
        <Route path='donations' element={<DonationsNGO />} />
        <Route path='impact-reports' element={<ImpactReportsNGO />} />
        <Route path='messages' element={<MessagesNGO />} />
        <Route path='withdrawals' element={<WithdrawalsNGO />} />
        <Route path='notifications' element={<NotificationsNGO />} />
        <Route path='settings' element={<NGOSettingsContent />} />
        <Route path='contact&help' element={<ContactAndHelpComponent />} />
        <Route path='logout' element={<LogoutComponent />} />
      </Route>

      {/* Admin dashboard routing */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} >
        <Route path='dashboard' element={<AdminDashboardContent />} />
        <Route path='ngo-moderation' element={<AdminNGOModeration />} />
        <Route path='users' element={<AdminUsers />} />
        <Route path='reports' element={<AdminReports />} />
        <Route path='notifications' element={<AdminNotifications />} />
        <Route path='contact&help' element={<ContactAndHelpComponent />} />
        <Route path='logout' element={<LogoutComponent />} />
      </Route>

      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <>
              <Headers />
              <div className="relative bg-white">
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
                  <svg viewBox="0 0 1440 120" fill="#0A2A5C" xmlns="http://www.w3.org/2000/svg" className="w-full h-32">
                    <path
                      d="M0,80 C480,160 960,0 1440,80 L1440,120 L0,120 Z"
                      fill="#0A2A5C"
                    />
                  </svg>
                </div>
                <div className="relative z-10">
                  <Home />
                </div>
              </div>
            </>
          </ProtectedRoute>
        }
      />
      <Route path="/donor-home" element={<ProtectedRoute><DonorHome /></ProtectedRoute>} />
      <Route path="/ngo-home" element={<ProtectedRoute><NGOHome /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {

  const { user } = useAuth();

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Toaster />
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup/" element={<SignupForm />} />
          <Route path="/signup/:role" element={<SignupForm />} />
          <Route path="/login" element={<LoginPageForm />} />
          <Route path="/login/:role" element={<LoginPageForm />} />
          <Route path="/donate" element={<CTAPage />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
