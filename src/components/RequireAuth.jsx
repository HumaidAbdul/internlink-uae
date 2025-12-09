import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const getUser = () => {
  try {
    return (
      JSON.parse(sessionStorage.getItem('user')) ||
      JSON.parse(localStorage.getItem('user')) ||
      null
    );
  } catch {
    return null;
  }
};

const getToken = () =>
  sessionStorage.getItem('token') || localStorage.getItem('token');

export default function RequireAuth({ roles }) {
  const location = useLocation();
  const token = getToken();
  const user = getUser();

  // مو مسجّل دخول
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // نطبّع قيمة الـ role إلى lowercase
  const userRole = (user.role || '').toLowerCase();
  const allowedRoles = roles ? roles.map((r) => r.toLowerCase()) : null;

  // ما عنده صلاحية للراوت
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={{ me: user }} />;
}

