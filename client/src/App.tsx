import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TopNav } from './components/layout/TopNav';
import { Footer } from './components/layout/Footer';
import { Spinner } from './components/ui/Spinner';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import { ToastContainer } from './components/ui/Toast';

const Home = lazy(() => import('./pages/Home'));
const Destinations = lazy(() => import('./pages/Destinations'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'));
const Planner = lazy(() => import('./pages/Planner'));
const Compare = lazy(() => import('./pages/Compare'));
const Culture = lazy(() => import('./pages/Culture'));
const CultureDetail = lazy(() => import('./pages/CultureDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Trips = lazy(() => import('./pages/Trips'));
const TripDetail = lazy(() => import('./pages/TripDetail'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Passport = lazy(() => import('./pages/Passport'));
const Preferences = lazy(() => import('./pages/Preferences'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Spinner />
    </div>
  );
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <TopNav />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/culture" element={<Culture />} />
          <Route path="/culture/:slug" element={<CultureDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
          <Route path="/trips/:id" element={<ProtectedRoute><TripDetail /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/passport" element={<ProtectedRoute><Passport /></ProtectedRoute>} />
          <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <ToastContainer />
    </div>
  );
}
