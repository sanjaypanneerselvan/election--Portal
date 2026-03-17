import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';
import { AnimatePresence } from 'framer-motion';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Candidates from './pages/Candidates';
import Parties from './pages/Parties';
import Complaints from './pages/Complaints';
import Awareness from './pages/Awareness';
import CandidateManager from './pages/CandidateManager';
import AnnouncementManager from './pages/AnnouncementManager';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/awareness" element={<PageTransition><Awareness /></PageTransition>} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute role="citizen">
            <PageTransition><Dashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <PageTransition><AdminDashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin/candidates" element={
          <ProtectedRoute role="admin">
            <PageTransition><CandidateManager /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin/announcements" element={
          <ProtectedRoute role="admin">
            <PageTransition><AnnouncementManager /></PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="/candidates" element={
          <ProtectedRoute>
            <PageTransition><Candidates /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/parties" element={
          <ProtectedRoute>
            <PageTransition><Parties /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/complaints" element={
          <ProtectedRoute>
            <PageTransition><Complaints /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <PageTransition><Analytics /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PageTransition><Profile /></PageTransition>
          </ProtectedRoute>
        } />

        {/* Redirects */}
        <Route path="/" element={<HomeRedirect />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <AnimatedRoutes />
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
