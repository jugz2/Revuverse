import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import BusinessList from './pages/dashboard/BusinessList';
import BusinessDetail from './pages/dashboard/BusinessDetail';
import AddBusiness from './pages/dashboard/AddBusiness';
import ReviewRequests from './pages/dashboard/ReviewRequests';
import Feedback from './pages/dashboard/Feedback';
import Reviews from './pages/dashboard/Reviews';
import Analytics from './pages/dashboard/Analytics';
import Settings from './pages/dashboard/Settings';
import Subscription from './pages/dashboard/Subscription';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Pricing from './pages/public/Pricing';
import Contact from './pages/public/Contact';
import FeedbackForm from './pages/public/FeedbackForm';
import NotFound from './pages/public/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/feedback/:requestId" element={<FeedbackForm />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Dashboard Routes (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="businesses" element={<BusinessList />} />
        <Route path="businesses/add" element={<AddBusiness />} />
        <Route path="businesses/:id" element={<BusinessDetail />} />
        <Route path="review-requests" element={<ReviewRequests />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="subscription" element={<Subscription />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App; 