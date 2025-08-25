import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/projects') return 'Projects';
    if (path.startsWith('/projects/')) return 'Project Details';
    return 'Quality Assurance Platform';
  };

  const authUserRaw = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
  const authUser = (() => { try { return authUserRaw ? JSON.parse(authUserRaw) : null; } catch { return null; } })();
  const displayName = authUser?.fullName || authUser?.username || authUser?.email || 'User';
  const role = authUser?.role || 'USER';
  const initials = (() => {
    const parts = String(displayName).trim().split(/\s+/);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  })();

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-danger text-danger-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium">{displayName}</div>
              <div className="text-xs text-muted-foreground">
                <span className="status-pill status-active">{role}</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <span className="font-medium">{initials}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;