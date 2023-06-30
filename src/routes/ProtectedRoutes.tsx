import React from "react";
import { Navigate } from "react-router-dom";

export interface PrivateRouteProps {
  component: React.ComponentType;
}

const ProtectedRoutes: React.FC<PrivateRouteProps> = ({
  component: Component,
}) => {
  const isDate = localStorage.getItem("isDate");

  return isDate ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
