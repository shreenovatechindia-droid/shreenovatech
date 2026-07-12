import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage      from './pages/LoginPage';
import DashboardPage  from './pages/DashboardPage';
import BookingsPage   from './pages/BookingsPage';
import ContactsPage   from './pages/ContactsPage';
import PaymentsPage   from './pages/PaymentsPage';
import PlaceholderPage from './pages/PlaceholderPage';
import './styles/admin.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontSize:14, color:'var(--muted)' }}>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/dashboard"   element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/bookings"    element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
      <Route path="/contacts"    element={<ProtectedRoute><ContactsPage /></ProtectedRoute>} />
      <Route path="/payments"    element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
      <Route path="/portfolio"   element={<ProtectedRoute><PlaceholderPage title="Portfolio" icon="🖼️" /></ProtectedRoute>} />
      <Route path="/pricing"     element={<ProtectedRoute><PlaceholderPage title="Pricing" icon="💰" /></ProtectedRoute>} />
      <Route path="/testimonials"element={<ProtectedRoute><PlaceholderPage title="Testimonials" icon="⭐" /></ProtectedRoute>} />
      <Route path="/faqs"        element={<ProtectedRoute><PlaceholderPage title="FAQs" icon="❓" /></ProtectedRoute>} />
      <Route path="/hosting"     element={<ProtectedRoute><PlaceholderPage title="Hosting Plans" icon="🌐" /></ProtectedRoute>} />
      <Route path="/blog"        element={<ProtectedRoute><PlaceholderPage title="Blog" icon="📝" /></ProtectedRoute>} />
      <Route path="/media"       element={<ProtectedRoute><PlaceholderPage title="Media" icon="🗂️" /></ProtectedRoute>} />
      <Route path="/seo"         element={<ProtectedRoute><PlaceholderPage title="SEO Settings" icon="🔍" /></ProtectedRoute>} />
      <Route path="/users"       element={<ProtectedRoute><PlaceholderPage title="Users" icon="👥" /></ProtectedRoute>} />
      <Route path="/settings"    element={<ProtectedRoute><PlaceholderPage title="Settings" icon="⚙️" /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
