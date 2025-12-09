// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Home from './pages/home';

import Login from './pages/Login';
import RegisterType from './pages/RegisterType';
import RegisterStudent from './pages/RegisterStudent';
import RegisterCompany from './pages/RegisterCompany';

import UserProfile from './pages/UserProfile';
import StudentChangePassword from './pages/StudentChangePassword';
import EditProfile from './pages/EditStudentProfile';

import CreateInternship from './pages/CreateInternship';
import InternshipList from './pages/InternshipList';
import InternshipDetails from './pages/InternshipDetails';
import EditInternship from './pages/EditInternship';

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminDirectory from "./pages/AdminDirectory.jsx";
import AdminUserDetails from "./pages/AdminUserDetails.jsx";
import ApplicationDetails from "./pages/ApplicationDetails.jsx";
import AdminInternshipDetails from "./pages/AdminInternshipDetails.jsx";

import SharedLayout from './pages/SharedLayout';
import AdminLayout from './pages/AdminLayout';   // 👈 المهم: استيراد AdminLayout

import CompanyProfile from './pages/CompanyProfile';
import EmployerChangePassword from './pages/EmployerChangePassword';
import EditCompanyProfile from './pages/EditCompanyProfile';

import RequireAuth from './components/RequireAuth';

export default function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* صفحات عامة */}
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterType />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/register/company" element={<RegisterCompany />} />

        {/* 🔐 طالب + شركة */}
        <Route element={<RequireAuth roles={['student', 'employer']} />}>
          <Route element={<SharedLayout />}>
            {/* Student */}
            <Route path="/profile/student" element={<UserProfile />} />
            <Route path="/profile/student/edit" element={<EditProfile />} />
            <Route path="/profile/student/password" element={<StudentChangePassword />} />

            {/* Employer */}
            <Route path="/profile/company" element={<CompanyProfile />} />
            <Route path="/profile/company/edit" element={<EditCompanyProfile />} />
            <Route path="/profile/company/password" element={<EmployerChangePassword />} />

            {/* Internships */}
            <Route path="/internships" element={<InternshipList />} />
            <Route path="/internships/new" element={<CreateInternship />} />
            <Route path="/internships/:id" element={<InternshipDetails />} />
            <Route path="/internships/:id/edit" element={<EditInternship />} />
          </Route>
        </Route>

        {/* 🟦 أدمن */}
        <Route element={<RequireAuth roles={['admin']} />}>
          {/* كل صفحات الأدمن تاخذ AdminLayout (هيدر + لوق آوت + باك) */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/directory" element={<AdminDirectory />} />
            <Route path="/admin/users/:id" element={<AdminUserDetails />} />
            <Route path="/admin/applications/:id" element={<ApplicationDetails />} />
            <Route path="/admin/internships/:id" element={<AdminInternshipDetails />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
