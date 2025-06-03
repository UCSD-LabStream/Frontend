import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useLabAccess } from './LabAccessContext';

const LabProtectedRoute = () => {
  const { canAccessLab } = useLabAccess();

  if (canAccessLab) {
    return <Outlet />;
  } else {
    // Redirect if access not granted
    return <Navigate to="/" replace />;
  }
};

export default LabProtectedRoute;
