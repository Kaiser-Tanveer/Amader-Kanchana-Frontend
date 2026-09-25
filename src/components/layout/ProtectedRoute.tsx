import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppStore";
import type { AdminRole } from "@/types";

interface ProtectedRouteProps {
  allowedRoles?: AdminRole[];
}

const ProtectedRoute = ({ allowedRoles, children }: PropsWithChildren<ProtectedRouteProps>) => {
  const { token, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
