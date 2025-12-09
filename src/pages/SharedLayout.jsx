// src/pages/SharedLayout.jsx
import React, { useMemo, useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";

export default function SharedLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("user") ||
          localStorage.getItem("user") ||
          "null"
      );
    } catch {
      return null;
    }
  }, []);

  const logout = () => {
    sessionStorage.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const navClass = ({ isActive }) =>
    `sl-navLink${isActive ? " sl-navLinkActive" : ""}`;

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="sl">
      <style>{`
        .sl {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #F6F7F9;
          color: #0B1020;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }

        .sl-header {
          background: #fff;
          border-bottom: 1px solid #E5E7EB;
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .sl-headerInner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .sl-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: inherit;
          text-decoration: none;
          font-weight: 600;
          white-space: nowrap;
        }
        .sl-brand:hover { text-decoration: underline; }

        .sl-nav {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sl-navLink {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid transparent;
          text-decoration: none;
          color: inherit;
          background: transparent;
          font-size: 14px;
          white-space: nowrap;
        }
        .sl-navLink:hover {
          background: #f3f4f6;
          border-color: #e5e7eb;
        }
        .sl-navLinkActive {
          background: #eef2ff;
          border-color: #e5e7eb;
        }

        .sl-logout {
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          background: #fff;
          cursor: pointer;
          font-size: 14px;
          white-space: nowrap;
        }
        .sl-logout:hover {
          background: #f3f4f6;
        }

        .sl-main {
          flex: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 16px 32px;
          width: 100%;
          box-sizing: border-box;
        }

        .sl-footer {
          background: #fff;
          border-top: 1px solid #E5E7EB;
        }
        .sl-footerInner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 14px 16px;
          color: #6B7280;
          font-size: 12px;
        }

        /* ====== زر الهنبرقر ====== */
        .sl-menuToggle {
          display: none;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          background: #fff;
          cursor: pointer;
          align-items: center;
          justify-content: center;
        }
        .sl-menuToggle svg {
          width: 20px;
          height: 20px;
        }

        /* ====== موبايل: استخدم الهنبرقر وقائمة منسدلة ====== */
        @media (max-width: 768px) {
          .sl-headerInner {
            padding: 8px 12px;
          }

          .sl-menuToggle {
            display: inline-flex;
          }

          /* nav مخفية افتراضياً في الموبايل */
          .sl-nav {
            display: none;
          }

          .sl-nav.sl-navOpen {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            position: absolute;
            left: 0;
            right: 0;
            top: 56px; /* تحت الهيدر */
            margin: 0;
            padding: 8px 12px 12px;
            background: #ffffff;
            border-bottom: 1px solid #e5e7eb;
            box-shadow: 0 8px 20px rgba(15,23,42,0.08);
            gap: 6px;
          }

          .sl-navLink,
          .sl-logout {
            width: 100%;
            justify-content: flex-start;
            text-align: left;
            border-radius: 999px;
          }
        }

        /* ====== ديسكتوب: أظهر الناف دائمًا وأخفي الهنبرقر ====== */
        @media (min-width: 769px) {
          .sl-nav {
            display: flex;
          }
          .sl-menuToggle {
            display: none;
          }
        }
      `}</style>

      <header className="sl-header">
        <div className="sl-headerInner">
          <Link
            to="/internships"
            className="sl-brand"
            onClick={closeMenu}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2L20 7V17L12 22L4 17V7L12 2Z"
                stroke="#2563eb"
                strokeWidth="1.6"
                fill="none"
              />
            </svg>
            <span>InternLink UAE</span>
          </Link>

          {/* زر الهنبرقر للموبايل */}
          <button
            type="button"
            className="sl-menuToggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="#111827"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="#111827"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          <nav className={`sl-nav ${menuOpen ? "sl-navOpen" : ""}`}>
            <NavLink
              to="/internships"
              className={navClass}
              onClick={closeMenu}
            >
              Internships
            </NavLink>

            {user?.role === "student" && (
              <NavLink
                to="/profile/student"
                className={navClass}
                onClick={closeMenu}
              >
                My Profile
              </NavLink>
            )}

            {user?.role === "employer" && (
              <>
                <NavLink
                  to="/profile/company"
                  className={navClass}
                  onClick={closeMenu}
                >
                  Company
                </NavLink>
                <NavLink
                  to="/internships/new"
                  className={navClass}
                  onClick={closeMenu}
                >
                  Post Internship
                </NavLink>
              </>
            )}

            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={navClass}
                onClick={closeMenu}
              >
                Admin
              </NavLink>
            )}

            <button
              className="sl-logout"
              onClick={() => {
                closeMenu();
                logout();
              }}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="sl-main">
        <Outlet />
      </main>

      <footer className="sl-footer">
        <div className="sl-footerInner">
          © {new Date().getFullYear()} InternLink UAE
        </div>
      </footer>
    </div>
  );
}
