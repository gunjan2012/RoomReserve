import { Navigate } from "react-router-dom";
import React from "react";
import Footer from "../Pages/Footer";

interface PrivateRouteProps {
  component: React.ComponentType;
}

const AuthRoutes: React.FC<PrivateRouteProps> = ({ component: Component }) => {
  const token = localStorage.getItem("token");
  return token ? (
    <>
      <Component /> <Footer />
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default AuthRoutes;
