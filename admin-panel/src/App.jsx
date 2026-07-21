import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage        from './pages/LoginPage';
import DashboardPage    from './pages/DashboardPage';
import BookingsPage     from './pages/BookingsPage';
import ContactsPage     from './pages/ContactsPage';
import PaymentsPage     from './pages/PaymentsPage';
import PortfolioPage    from './pages/PortfolioPage';
import PricingPage      from './pages/PricingPage';
import TestimonialsPage from './pages/TestimonialsPage';
import FaqsPage         from './pages/FaqsPage';
import HostingPage      from './pages/HostingPage';
import BlogPage         from './pages/BlogPage';
import MediaPage        from './pages/MediaPage';
import SeoPage          from './pages/SeoPage';
import UsersPage        from './pages/UsersPage';
import SettingsPage     from './pages/SettingsPage';
import './styles/admin.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontSize:14, color:'var(--muted)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:32, marginBottom:12 }}>⚡</div>
        <p>Loading ShreeNova Tech Admin...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/"             element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/dashboard"    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/bookings"     element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
      <Route path="/contacts"     element={<ProtectedRoute><ContactsPage /></ProtectedRoute>} />
      <Route path="/payments"     element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
      <Route path="/portfolio"    element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
      <Route path="/pricing"      element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
      <Route path="/testimonials" element={<ProtectedRoute><TestimonialsPage /></ProtectedRoute>} />
      <Route path="/faqs"         element={<ProtectedRoute><FaqsPage /></ProtectedRoute>} />
      <Route path="/hosting"      element={<ProtectedRoute><HostingPage /></ProtectedRoute>} />
      <Route path="/blog"         element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
      <Route path="/media"        element={<ProtectedRoute><MediaPage /></ProtectedRoute>} />
      <Route path="/seo"          element={<ProtectedRoute><SeoPage /></ProtectedRoute>} />
      <Route path="/users"        element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      <Route path="/settings"     element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*"             element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/admin">
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
