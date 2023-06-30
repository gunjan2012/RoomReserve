import { createSlice } from "@reduxjs/toolkit";
import { bookingsStateType } from "../types/types";
import {
  cancelBooking,
  fetchBookings,
  fetchUserBookings,
  putBookingsDetails,
} from "./actions/bookingActions";

const initialState: bookingsStateType = {
  singleUserBookings: [],
  bookingsData: [],
  loading: false,
  error: null,
};

export const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUserBookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingsData = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(putBookingsDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(putBookingsDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingsData.push(action.payload);
        state.singleUserBookings.push(action.payload);
      })
      .addCase(putBookingsDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.bookingsData = action.payload.bookingsData;
          state.singleUserBookings = action.payload.singleUserbookingsData;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const bookingsActions = bookingsSlice.actions;
export default bookingsSlice.reducer;
