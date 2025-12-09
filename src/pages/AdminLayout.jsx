import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      {/* Top navbar */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        {/* left: logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "2px solid #2563eb",
              display: "inline-block",
            }}
          />
          <div>
            <div style={{ fontWeight: 600 }}>InternLink UAE</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Admin Panel</div>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="menu-btn"
          style={{
            display: "none",
            fontSize: 24,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        {/* middle: nav links */}
        <nav
          className="nav-links"
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <NavLink
            to="/admin/dashboard"
            style={({ isActive }) => ({
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 14,
              textDecoration: "none",
              color: isActive ? "#ffffff" : "#374151",
              background: isActive ? "#2563eb" : "transparent",
              border: "1px solid #d1d5db",
            })}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/directory"
            style={({ isActive }) => ({
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 14,
              textDecoration: "none",
              color: isActive ? "#ffffff" : "#374151",
              background: isActive ? "#2563eb" : "transparent",
              border: "1px solid #d1d5db",
            })}
          >
            Directory
          </NavLink>

          {/* Logout Desktop */}
          <button
            onClick={handleLogout}
            className="logout-desktop"
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="mobile-menu"
          style={{
            background: "#ffffff",
            padding: 16,
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <NavLink
            to="/admin/dashboard"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: "none", color: "#374151" }}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/directory"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: "none", color: "#374151" }}
          >
            Directory
          </NavLink>

          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* page content */}
      <main style={{ padding: "24px 32px" }}>
        <Outlet />
      </main>

      {/* responsive CSS */}
      <style>
        {`
        @media (max-width: 900px) {
          .nav-links {
            display: none !important;
          }
          .menu-btn {
            display: block !important;
          }
        }
      `}
      </style>
    </div>
  );
}
