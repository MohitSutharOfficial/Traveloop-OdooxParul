import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DocumentTitle from './components/DocumentTitle';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CommandPalette from './components/shared/CommandPalette';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import SignUp from './pages/SignUp';
import Trips from './pages/Trips';
import TripCreate from './pages/TripCreate';
import Itinerary from './pages/Itinerary';
import MapView from './pages/MapView';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import Community from './pages/Community';
import Checklist from './pages/Checklist';
import Notes from './pages/Notes';
import Invoice from './pages/Invoice';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <DocumentTitle />
          <CommandPalette />
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/trips" element={<Trips />} />
                      <Route path="/trip/create" element={<TripCreate />} />
                      <Route path="/itinerary/:id" element={<Itinerary />} />
                      <Route path="/map/:id" element={<MapView />} />
                      <Route path="/search/cities" element={<CitySearch />} />
                      <Route path="/search/activities" element={<ActivitySearch />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/checklist" element={<Checklist />} />
                      <Route path="/notes" element={<Notes />} />
                      <Route path="/invoice" element={<Invoice />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/admin" element={<Admin />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}
