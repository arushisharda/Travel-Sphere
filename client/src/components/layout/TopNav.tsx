import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePlanner } from '../../context/PlannerContext';
import { clsx } from 'clsx';

const NAV_LINKS = [
  { to: '/destinations', label: 'Destinations' },
  { to: '/planner', label: 'Planner' },
  { to: '/compare', label: 'Compare' },
  { to: '/culture', label: 'Culture' },
];

const USER_LINKS = [
  { to: '/trips', label: 'Trips' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/passport', label: 'Passport' },
  { to: '/preferences', label: 'Preferences' },
];

export function TopNav() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isGenerating, draft } = usePlanner();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-[var(--color-border)] bg-[var(--color-paper)]/90 backdrop-blur-sm">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-[var(--color-ink)] focus:px-3 focus:py-1 focus:text-[var(--color-paper)] focus:text-sm"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {/* Wordmark */}
          <Link to="/" className="font-display text-xl font-semibold text-[var(--color-ink)] tracking-tight">
            TravelSphere
          </Link>
          {/* Global generating indicator — visible from any page */}
          {isGenerating && (
            <Link
              to="/planner"
              className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-300 rounded-full px-3 py-1 font-medium hover:bg-amber-100 transition-colors animate-pulse"
            >
              <span className="inline-block h-2 w-2 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
              Drafting itinerary…
            </Link>
          )}
          {/* Ready badge — keeps itinerary easily accessible from any page */}
          {!isGenerating && draft && (
            <Link
              to="/planner"
              className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-full px-3 py-1 font-medium hover:bg-emerald-100 transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {draft.city ? `${draft.city} ready` : 'Itinerary ready'} · View →
            </Link>
          )}
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx('text-sm transition-colors', isActive ? 'text-[var(--color-ink)] font-medium' : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]')
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && USER_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx('text-sm transition-colors', isActive ? 'text-[var(--color-ink)] font-medium' : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-[var(--color-muted)]">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-[var(--color-paper)] hover:opacity-90 transition-opacity"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 text-[var(--color-ink)]"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-paper)] px-6 py-4 space-y-2">
          {[...NAV_LINKS, ...(isAuthenticated ? USER_LINKS : [])].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-[var(--color-ink)] text-sm"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[var(--color-border)]">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-sm text-[var(--color-muted)]">Sign out</button>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-[var(--color-muted)]">Sign in</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[var(--color-ink)]">Get started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
