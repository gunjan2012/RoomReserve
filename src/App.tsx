import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import Register from "./Pages/Register";
import UserProfile from "./Pages/UserProfile";
import AdminDashBoards from "./admin-panel/AdminDashBoards";
import AddHotelForm from "./admin-panel/AddHotelForm";
import BookingsList from "./admin-panel/BookingsList";
import UsersList from "./admin-panel/UsersList";
import Header from "./Pages/Header";
import "react-toastify/dist/ReactToastify.css";
import ErrorPage from "./Pages/ErrorPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store";
import { fetchHotelsData } from "./redux/actions/hotelActions";
import { fetchUserDetails } from "./redux/authSlice";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";
import UnAuthRoutes from "./routes/UnAuthRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import BookingDetails from "./Pages/BookingDetails";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUserDetails());
    dispatch(fetchHotelsData());
  }, [dispatch]);

  const checkExpiration = () => {
    const expirationTime = localStorage.getItem("expirationTime");
    if (expirationTime && new Date().getTime() > Number(expirationTime)) {
      // Session expired, clear storage and log out user
      localStorage.removeItem("expirationTime");
    }
  };

  // Check expiration when app loads
  checkExpiration();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="booking"
          element={<ProtectedRoutes component={BookingDetails} />}
        />
        <Route path="/login" element={<UnAuthRoutes component={LoginPage} />} />
        <Route
          path="/register"
          element={<UnAuthRoutes component={Register} />}
        />
        <Route
          path="/profile"
          element={<AuthRoutes component={UserProfile} />}
        />
        <Route
          path="/dashboard"
          element={<PrivateRoutes component={AdminDashBoards} />}
        >
          <Route path="hotels" element={<AdminDashBoards />} />
          <Route path="add" element={<AddHotelForm />} />
          <Route path="bookings" element={<BookingsList />} />
          <Route path="users" element={<UsersList />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default App;
