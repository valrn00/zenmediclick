// frontend/src/shared/components/RoleRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirectPaths = {
      admin: '/admin/dashboard',
      medico: '/medico/dashboard',
      paciente: '/paciente/dashboard'
    };
    return <Navigate to={redirectPaths[user.role] || '/login'} replace />;
  }

  return children;
};

export default RoleRoute;