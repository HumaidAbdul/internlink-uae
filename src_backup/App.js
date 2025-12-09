import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

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



import SharedLayout from './pages/SharedLayout';

import CompanyProfile from './pages/CompanyProfile';
import EmployerChangePassword from './pages/EmployerChangePassword';
import EditCompanyProfile from './pages/EditCompanyProfile';


import RequireAuth from './components/RequireAuth';




export default function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>

        {/* محمية (طالب/شركة/أدمن) */}
        <Route element={<RequireAuth roles={['student','employer']} />}>
          <Route element={<SharedLayout />}>
            <Route path="/profile/student" element={<UserProfile />} />
            <Route path="/profile/student/edit" element={<EditProfile />} />
            <Route path="/profile/student/password" element={<StudentChangePassword />} />

            <Route path="/profile/company" element={<CompanyProfile />} />
            <Route path="/profile/company/edit" element={<EditCompanyProfile />} />
            <Route path="/profile/company/password" element={<EmployerChangePassword />} />

             <Route path="/internships" element={<InternshipList />} />
            <Route path="/internships/new" element={<CreateInternship />} />
            <Route path="/internships/:id" element={<InternshipDetails />} />
            <Route path="/internships/:id/edit" element={<EditInternship />} />



          </Route>
        </Route>

        {/* عامّة */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterType />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/register/company" element={<RegisterCompany />} />
      </Routes>
      
    </Router>
  );
}
