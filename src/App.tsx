import React from'react';
import { Routes, Route, Navigate } from'react-router-dom';
import { AppShell } from'./layout/AppShell';
import { Dashboard } from'./features/dashboard/Dashboard';
import { Profile } from'./pages/Profile';

export default function App() {

  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Public routes */}
        {/* Main Application */}
        <Route path="/"element={<Dashboard />} />
        <Route path="/dashboard"element={<Navigate to="/"replace />} />
        <Route path="/profile"element={<Profile />} />
        
        <Route path="*"element={<Navigate to="/"replace />} />
      </Route>
    </Routes>
  );
}

