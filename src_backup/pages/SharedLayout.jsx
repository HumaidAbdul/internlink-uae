import React, { useMemo } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';

export default function SharedLayout() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || 'null');
    } catch { return null; }
  }, []);

  const logout = () => {
    sessionStorage.clear();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const navClass = ({ isActive }) =>
    `sl-navLink${isActive ? ' sl-navLinkActive' : ''}`;

  return (
    <div className="sl">
      {/* ⬇️ page-scoped styles */}
      <style>{`
        .sl { min-height: 100vh; display:flex; flex-direction:column; background:#F6F7F9; color:#0B1020; font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif; }
        .sl-header { background:#fff; border-bottom:1px solid #E5E7EB; }
        .sl-headerInner { max-width:1100px; margin:0 auto; padding:12px 16px; display:flex; align-items:center; justify-content:space-between; }
        .sl-brand { display:flex; align-items:center; gap:10px; color:inherit; text-decoration:none; }
        .sl-brand:hover { text-decoration:underline; }

        .sl-nav { display:flex; align-items:center; gap:10px; }
        .sl-navLink { display:inline-block; padding:8px 12px; border-radius:10px; border:1px solid transparent; text-decoration:none; color:inherit; }
        .sl-navLink:hover { background:#f3f4f6; border-color:#e5e7eb; }
        .sl-navLinkActive { background:#eef2ff; border-color:#e5e7eb; }
        .sl-logout { padding:8px 12px; border-radius:10px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; }
        .sl-logout:hover { background:#f3f4f6; }

        .sl-main { flex:1; max-width:1100px; margin:0 auto; padding:24px 16px; }
        .sl-footer { background:#fff; border-top:1px solid #E5E7EB; }
        .sl-footerInner { max-width:1100px; margin:0 auto; padding:14px 16px; color:#6B7280; font-size:12px; }
      `}</style>

      <header className="sl-header">
        <div className="sl-headerInner">
          <Link to="/internships" className="sl-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#2563eb" strokeWidth="1.6" fill="none"/>
            </svg>
            <strong>InternLink UAE</strong>
          </Link>

          <nav className="sl-nav">
            <NavLink to="/internships" className={navClass}>Internships</NavLink>

            {user?.role === 'student' && (
              <>
                <NavLink to="/profile/student" className={navClass}>My Profile</NavLink>
                {/* <NavLink to="/messages" className={navClass}>Messages</NavLink> */}
              </>
            )}

            {user?.role === 'employer' && (
              <>
                <NavLink to="/profile/company" className={navClass}>Company</NavLink>
                <NavLink to="/internships/new" className={navClass}>Post Internship</NavLink>
              </>
            )}

            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navClass}>Admin</NavLink>
            )}

            <button className="sl-logout" onClick={logout}>Logout</button>
          </nav>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>

      <footer className="sl-footer">
        <div className="sl-footerInner">© {new Date().getFullYear()} InternLink UAE</div>
      </footer>
    </div>
  );
}
