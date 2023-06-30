import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PrivateRouteProps } from "./ProtectedRoutes";
import { Navigate } from "react-router-dom";
import { AppDispatch, RootState } from "../redux/store";
import { fetchUsers } from "../redux/actions/usersActions";
import { fetchBookings } from "../redux/actions/bookingActions";
import Footer from "../Pages/Footer";

const PrivateRoutes: React.FC<PrivateRouteProps> = ({
  component: Component,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchBookings());
  }, [dispatch]);

  return userData?.isAdmin ? (
    <>
      <Component />
      <Footer />
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoutes;
