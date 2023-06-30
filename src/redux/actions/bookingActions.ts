import { addDoc, getDocs, query, where } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";
import { bookingsInterface } from "../../types/types";
import {
  addBookingToHotel,
  cancelBookingToHotel,
  firestore,
} from "../hotelSlice";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { HotelDataInterface } from "../../types/types";
import { FirestoreDocument } from "../../types/types";

export const putBookingsDetails = createAsyncThunk(
  "bookings/putBookingsDetails",
  async (bookingDetails: bookingsInterface, { rejectWithValue, dispatch }) => {
    try {
      const collectionRef = await addDoc(
        collection(firestore, "bookings"),
        bookingDetails
      );
      const id = collectionRef.id;
      const data = bookingDetails;
      dispatch(
        addBookingToHotel({
          hotelId: bookingDetails.room_id,
          booking: data,
        })
      );
      return { id, data };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to book hotel");
    }
  }
);

interface propTypes {
  bookId: string;
  transId: string;
  roomId: string;
  userId: string;
}

export const cancelBooking = createAsyncThunk(
  "bookings/cancelBooking",
  async (
    { bookId, transId, roomId, userId }: propTypes,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const bookingRef = doc(firestore, "bookings", bookId);
      // Delete the booking document
      await deleteDoc(bookingRef);
      // Create a document reference to the room document

      const roomRef = doc(firestore, "rooms", roomId);
      const docSnap = await getDoc(roomRef);
      const data = docSnap.data() as HotelDataInterface;
      const updatedBookings = data.currentBookings.filter(
        (booking) => booking.transaction_id !== transId
      );

      const collectionRef = collection(firestore, "bookings");
      const bookSnap = await getDocs(collectionRef);
      const bookingsData: FirestoreDocument<bookingsInterface>[] = [];
      const singleUserbookingsData: FirestoreDocument<bookingsInterface>[] = [];

      bookSnap.forEach((booking) => {
        const data = booking.data();
        if (data.uid === userId) {
          singleUserbookingsData.push({
            id: booking.id,
            data: booking.data() as bookingsInterface,
          });
        }
        bookingsData.push({
          id: booking.id,
          data: booking.data() as bookingsInterface,
        });
      });

      await updateDoc(roomRef, {
        currentBookings: updatedBookings,
      });

      dispatch(cancelBookingToHotel({ roomId, transId }));

      return { bookingsData, singleUserbookingsData };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const fetchBookings = createAsyncThunk(
  "hotel/fetchBookings",
  async () => {
    const collectionRef = collection(firestore, "bookings");
    const snap = await getDocs(collectionRef);
    const bookingsData: FirestoreDocument<bookingsInterface>[] = [];
    snap.forEach((doc) => {
      const id = doc.id;
      const {
        room_id,
        uid,
        hotelName,
        checkInDate,
        checkOutDate,
        totalDays,
        totalAmount,
        phoneNumber,
        userName,
        type,
        transaction_id,
        location,
      } = doc.data();
      const data = {
        room_id,
        uid,
        hotelName,
        checkInDate,
        checkOutDate,
        totalDays,
        totalAmount,
        phoneNumber,
        userName,
        type,
        transaction_id,
        location,
      };
      bookingsData.push({ id, data });
    });

    return bookingsData;
  }
);

export const fetchUserBookings = createAsyncThunk(
  "bookings/fetchUserBookings",
  async (uid: string, { rejectWithValue }) => {
    try {
      const collectionRef = collection(firestore, "bookings");
      const q = query(collectionRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const bookingData: FirestoreDocument<bookingsInterface>[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as bookingsInterface;
        const id = doc.id;
        bookingData.push({ id, data });
      });
      return bookingData;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to get booking data");
    }
  }
);
