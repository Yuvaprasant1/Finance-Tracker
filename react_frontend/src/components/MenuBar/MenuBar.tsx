import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { LayoutDashboard, Receipt, User, Moon, Sun, Menu, X, LogOut, Mail, Wallet } from 'lucide-react';
import './MenuBar.css';

const MenuBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, clearUserId } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.menu-bar') && !target.closest('.mobile-menu-overlay')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = (): void => {
    if (window.confirm('Do you want to logout and switch user?')) {
      clearUserId();
      navigate('/login');
    }
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleMenuClick = (path: string): void => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="menu-bar">
        <div className="menu-left">
          <h1 className="menu-logo">
            <Wallet size={20} className="menu-logo-icon" />
            Finance Tracker
          </h1>
          <div className="menu-items desktop-menu">
            <button
              className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              <LayoutDashboard size={20} className="menu-icon" />
              Dashboard
            </button>
            <button
              className={`menu-item ${isActive('/transaction') ? 'active' : ''}`}
              onClick={() => navigate('/transaction')}
            >
              <Receipt size={20} className="menu-icon" />
              Transactions
            </button>
            <button
              className={`menu-item ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => navigate('/profile')}
            >
              <User size={20} className="menu-icon" />
              Profile
            </button>
          </div>
        </div>
        <div className="menu-right">
          <div className="phone-display desktop-phone">
            <Mail size={18} className="phone-icon" />
            <span className="phone-text">{email}</span>
          </div>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="logout-button desktop-logout" onClick={handleLogout} title="Switch User">
            <LogOut size={18} />
            Logout
          </button>
          <button
            className="hamburger-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h2 className="mobile-menu-title">Menu</h2>
              <div className="mobile-phone-display">
                <Mail size={18} className="phone-icon" />
                <span className="phone-text">{email}</span>
              </div>
            </div>
            <div className="mobile-menu-items">
              <button
                className={`mobile-menu-item ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={() => handleMenuClick('/dashboard')}
              >
                <LayoutDashboard size={20} className="menu-icon" />
                <span>Dashboard</span>
              </button>
              <button
                className={`mobile-menu-item ${isActive('/transaction') ? 'active' : ''}`}
                onClick={() => handleMenuClick('/transaction')}
              >
                <Receipt size={20} className="menu-icon" />
                <span>Transactions</span>
              </button>
              <button
                className={`mobile-menu-item ${isActive('/profile') ? 'active' : ''}`}
                onClick={() => handleMenuClick('/profile')}
              >
                <User size={20} className="menu-icon" />
                <span>Profile</span>
              </button>
            </div>
            <div className="mobile-menu-footer">
              <button
                className="mobile-theme-toggle"
                onClick={toggleTheme}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
              <button className="mobile-logout-button" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuBar;

