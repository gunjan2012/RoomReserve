import { configureStore } from "@reduxjs/toolkit";
import hotelSlice from "./hotelSlice";
import authSlice from "./authSlice";
import bookingSlice from "./bookingSlice";

const store = configureStore({
  reducer: {
    hotels: hotelSlice,
    auth: authSlice,
    bookings: bookingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
