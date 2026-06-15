import React, { useState, useEffect } from'react';
import { Link, useLocation } from'react-router-dom';
import { Menu, X, Moon, Sun } from'lucide-react';
import type { User } from'../types';
import { cn } from'../lib/utils';

interface NavbarProps {
  variant:'public' |'app';
  user?: User | null;
  onLogout?: () => void;
}

export function Navbar({ variant, user, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const location = useLocation();

  const isPub = variant ==='public';

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const pubLinks = [
    { label:'How it works', href:'/#how-it-works' },
    { label:'Impact', href:'/#impact' },
  ];

  const appLinks = [
    { label:'Dashboard', href:'/dashboard' },
  ];

  const links = isPub ? pubLinks : appLinks;

  return (
    <nav className="sticky top-0 z-50 h-14 bg-white  border-b border-gray-200"role="navigation"aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link to={isPub ?'/' :'/dashboard'} className="flex items-center gap-2"aria-label="Carbon Tracky Home">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-2xl">🌍</div>
          <span className="font-medium text-[16px]">Carbon Tracky</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center justify-center flex-1 gap-6">
          {links.map(l => {
            const isActive = location.pathname === l.href;
            return (
              <Link 
                key={l.href} 
                to={l.href}
                className={cn("text-[13px] transition-colors", isActive ?"text-[#1967d2]  font-medium":"text-gray-500 hover:text-gray-900  :text-gray-200")}
                aria-current={isActive ?'page' : undefined}
              >
                {l.label}
              </Link>
            )
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isPub ? (
            <Link to="/dashboard"className="text-[13px] px-4 py-2 rounded-full bg-[#1a73e8] text-white font-medium hover:bg-[#1967d2] transition-colors shadow-sm">Get started</Link>
          ) : (
            <Link to="/profile"className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-[#e8f0fe] border border-[#8ab4f8] flex items-center justify-center text-[12px] font-medium text-[#1967d2] group-hover:bg-[#8ab4f8] transition-colors">
                {user?.name ? user.name.substring(0,2).toUpperCase() :'ME'}
              </div>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-md"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div id="mobile-menu"className="md:hidden absolute top-14 left-0 w-full bg-white  border-b border-gray-200 shadow-lg px-4 pt-2 pb-4 flex flex-col gap-2">
          {links.map(l => (
            <Link 
              key={l.href} 
              to={l.href}
              className="block py-2 text-[14px] text-gray-600"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-2">
            {isPub ? (
              <Link to="/dashboard"onClick={() => setMobileOpen(false)} className="text-center text-[13px] py-2 rounded-full bg-[#1a73e8] text-white font-medium shadow-sm">Get started</Link>
            ) : (
              <>
                <Link to="/profile"onClick={() => setMobileOpen(false)} className="block py-2 text-[14px] text-gray-600">Profile</Link>
                <button onClick={() => { setMobileOpen(false); onLogout?.(); }} className="block w-full text-left py-2 text-[14px] text-red-600">Sign out</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
