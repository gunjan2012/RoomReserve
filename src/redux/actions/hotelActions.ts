import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../hotelSlice";
import { FirestoreDocument, HotelDataInterface } from "../../types/types";
import { FirebaseError } from "firebase/app";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, updateDoc } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import { fetchBookings } from "./bookingActions";

export const fetchHotelsData = createAsyncThunk(
  "hotel/fetchHotels",
  async (_, { rejectWithValue }) => {
    try {
      const collectionRef = collection(firestore, "rooms");
      const snap = await getDocs(collectionRef);
      const hotelsData: FirestoreDocument<HotelDataInterface>[] = [];
      snap.forEach((doc) => {
        hotelsData.push({ id: doc.id, data: doc.data() as HotelDataInterface });
      });
      return hotelsData;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const addHotelAction = createAsyncThunk(
  "hotel/addHotel",
  async (hotelDetails: HotelDataInterface, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(firestore, "rooms"), hotelDetails);
      return { id: docRef.id, data: hotelDetails };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

interface updatedData {
  editedData: HotelDataInterface;
  id: string;
}
export const updateHotelAction = createAsyncThunk(
  "hotel/updateHotel",
  async ({ editedData, id }: updatedData, { rejectWithValue }) => {
    try {
      const docRef = doc(firestore, "rooms", id);
      const {
        name,
        maxCount,
        rentPerDay,
        currentBookings,
        description,
        phoneNumber,
        type,
        imgUrls,
        location,
      } = editedData;
      const newData = {
        name,
        maxCount,
        rentPerDay,
        currentBookings,
        description,
        phoneNumber,
        type,
        imgUrls,
        location,
      };
      await updateDoc(docRef, newData);
      return { editedData, id };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteHotelAction = createAsyncThunk(
  "hotel/deleteHotel",
  async (hotelId: string, { rejectWithValue, dispatch }) => {
    try {
      const hotelRef = doc(firestore, "rooms", hotelId);
      await deleteDoc(hotelRef);

      const collectionRef = collection(firestore, "bookings");
      let collectionExists = false;

      await getDocs(collectionRef).then((querySnapshot) => {
        if (querySnapshot.empty) {
          collectionExists = false;
        } else {
          collectionExists = true;
        }
      });

      if (collectionExists) {
        const q = query(collectionRef, where("room_id", "==", hotelId));
        const querySnapshot = await getDocs(q);

        // Delete the booking document
        let bookId = "";
        querySnapshot.forEach((booking) => {
          bookId = booking.id;
        });
        const bookingRef = doc(firestore, "bookings", bookId);
        await deleteDoc(bookingRef);
        dispatch(fetchBookings());
      }
      await dispatch(fetchHotelsData());
      return hotelId;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);
