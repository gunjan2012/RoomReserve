import React from "react";
import { Navigate } from "react-router-dom";
import Footer from "../Pages/Footer";

interface PrivateRouteProps {
  component: React.ComponentType;
}

const UnAuthRoutes: React.FC<PrivateRouteProps> = ({
  component: Component,
}) => {
  const token = localStorage.getItem("token");
  return token ? (
    <Navigate to="/" />
  ) : (
    <>
      <Component />
      <Footer />
    </>
  );
};

export default UnAuthRoutes;
