// src/pages/StudentChangePassword.jsx
import React from 'react';
import ChangePassword from './ChangePassword';

export default function StudentChangePassword() {
  return (
    <ChangePassword
      title="Change Password (Student)"
      submitPath="/api/student/password"
      backTo="/profile/student"
    />
  );
}
