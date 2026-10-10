import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ParkingLocationsPage from '../pages/ParkingLocationsPage';
import ParkingSlotDetailsPage from '../pages/ParkingSlotDetailsPage';
import ReservationPage from '../pages/ReservationPage';
import BookingConfirmationPage from '../pages/BookingConfirmationPage';
import MyBookingsPage from '../pages/MyBookingsPage';
import ProfilePage from '../pages/ProfilePage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import { ProtectedRoute, AdminRoute } from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="parking" element={<ParkingLocationsPage />} />
        <Route path="parking/:id" element={<ParkingSlotDetailsPage />} />

        {/* Protected: authenticated users only */}
        <Route path="reservation" element={
          <ProtectedRoute><ReservationPage /></ProtectedRoute>
        } />
        <Route path="booking/:id" element={
          <ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>
        } />
        <Route path="my-bookings" element={
          <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />

        {/* Admin-only */}
        <Route path="admin" element={
          <AdminRoute><AdminDashboardPage /></AdminRoute>
        } />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
