import { createAsyncThunk } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../hotelSlice";
import { FirestoreDocument, usersInterface } from "../../types/types";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const collectionRef = collection(firestore, "users");
      const usersListSnap = await getDocs(collectionRef);
      const usersList: FirestoreDocument<usersInterface>[] = [];
      usersListSnap.forEach((doc) => {
        usersList.push({ id: doc.id, data: doc.data() as usersInterface });
      });
      return usersList;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);
