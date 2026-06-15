import React from'react';
import { Outlet } from'react-router-dom';
import { Navbar } from'./Navbar';
import { Footer } from'./Footer';
import { useAuthStore } from'../store/authStore';

export function AppShell() {
  const { user, logout } = useAuthStore();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar variant={user ?'app' :'public'} user={user} onLogout={logout} />
      <main id="main-content"className="flex-1 flex flex-col pt-8 pb-16">
        <Outlet />
      </main>
      {!user && <Footer />}
    </div>
  );
}
