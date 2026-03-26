import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Screens
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Trips from './screens/Trips';
import TripDetail from './screens/TripDetail';
import CreateTrip from './screens/CreateTrip';
import Experiences from './screens/Experiences';
import ExperienceDetail from './screens/ExperienceDetail';
import CreateExperience from './screens/CreateExperience';
import Clubs from './screens/Clubs';
import ClubDetail from './screens/ClubDetail';
import Profile from './screens/Profile';
import Social from './screens/Social';
import Layout from './components/Layout';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route (redirects to home if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Protected routes with layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="trips" element={<Trips />} />
            <Route path="trips/create" element={<CreateTrip />} />
            <Route path="trips/:id" element={<TripDetail />} />
            <Route path="experiences" element={<Experiences />} />
            <Route path="experiences/create" element={<CreateExperience />} />
            <Route path="experiences/:id" element={<ExperienceDetail />} />
            <Route path="clubs" element={<Clubs />} />
            <Route path="clubs/:id" element={<ClubDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="social" element={<Social />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
