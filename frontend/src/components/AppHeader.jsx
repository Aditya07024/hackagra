import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AppHeader() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Only render the header if not on the landing page
  if (location.pathname === '/' && !isAuthenticated) {
    return null;
  }

  // This component can be removed or used for other purposes
  return null;
}
