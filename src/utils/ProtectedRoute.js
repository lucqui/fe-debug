import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRoles }) => {
  const isLoggedin = useSelector((state) => state.user.isLoggedin);
  const userRole = useSelector((state) => state.user.user.role);
  const isSessionLoaded = useSelector((state) => state.user.isSessionLoaded);

  const hasAccess = (requiredRoles) => requiredRoles.includes(userRole);

  if (!isSessionLoaded) {
    return null; // or a loading indicator
  }

  if (!isLoggedin) {
    return <Navigate to="/" replace />;
  }

  if (isLoggedin && !hasAccess(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;