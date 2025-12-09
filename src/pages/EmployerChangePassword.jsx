// src/pages/EmployerChangePassword.jsx
import React from 'react';
import ChangePassword from './ChangePassword';

export default function EmployerChangePassword() {
  return (
    <ChangePassword
      title="Change Password (Employer)"
      submitPath="/api/employer/password"
      backTo="/profile/company"
    />
  );
}
