import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const getUser  = () => {
  try { return JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || 'null'); }
  catch { return null; }
};
const getToken = () => sessionStorage.getItem('token') || localStorage.getItem('token');

export default function RequireAuth({ roles }) {
  const location = useLocation();
  const token = getToken();
  const user  = getUser();

  if (!token || !user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return <Outlet context={{ me: user }} />;
}
