import { createSlice } from "@reduxjs/toolkit";
import { getFirestore } from "firebase/firestore";
import { app } from "../firebase";
import { stateObjectType } from "../types/types";
import {
  addHotelAction,
  deleteHotelAction,
  fetchHotelsData,
  updateHotelAction,
} from "./actions/hotelActions";

const initialState: stateObjectType = {
  hotelsData: [],
  loading: false,
  error: null,
};

export const firestore = getFirestore(app);

const hotelSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    addBookingToHotel: (state, action) => {
      const { hotelId, booking } = action.payload;
      const hotel = state.hotelsData.find((hotel) => hotel.id === hotelId);
      if (hotel) {
        hotel.data.currentBookings.push(booking);
      }
    },
    cancelBookingToHotel: (state, action) => {
      const { roomId, transId } = action.payload;
      const hotel = state.hotelsData.find((hotel) => hotel.id === roomId);
      if (hotel) {
        hotel.data.currentBookings = hotel.data.currentBookings.filter(
          (hotel) => hotel.transaction_id !== transId
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotelsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelsData.fulfilled, (state, action) => {
        state.loading = false;
        action.payload && (state.hotelsData = action.payload);
      })
      .addCase(fetchHotelsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addHotelAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHotelAction.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.hotelsData.push(action.payload);
        }
      })
      .addCase(addHotelAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteHotelAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHotelAction.fulfilled, (state, action) => {
        state.loading = false;
        state.hotelsData = state.hotelsData.filter(
          (hotel) => hotel.id !== action.payload
        );
      })
      .addCase(deleteHotelAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateHotelAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHotelAction.fulfilled, (state, action) => {
        state.loading = false;
        state.hotelsData.filter((hotel) => {
          if (hotel.id === action.payload?.id) {
            hotel.data = action.payload.editedData;
          }
        });
      })
      .addCase(updateHotelAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addBookingToHotel, cancelBookingToHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
