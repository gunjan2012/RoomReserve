import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { AuthState, usersInterface } from "../types/types";
import { firestore } from "./hotelSlice";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { fetchUsers } from "./actions/usersActions";
import { convertFirebaseErrorMessage } from "../utils/convertFirebaseErrorMessage";

const initialState: AuthState = {
  user: null,
  usersList: [],
  loading: false,
  error: null,
};

export const signUpUser = createAsyncThunk(
  "auth/signUp",
  async (
    {
      email,
      password,
      name,
    }: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const uid = user.uid;
      await updateProfile(user, { displayName: name });
      await addDoc(collection(firestore, "users"), {
        name: name,
        uid: uid,
        email: user.email,
        isAdmin: false,
      });
      return { name, email, uid, isAdmin: false };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to create user");
    }
  }
);

export const signInUser = createAsyncThunk(
  "auth/signIn",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const uid = user.uid;
      const collectionRef = collection(firestore, "users");
      const q = query(collectionRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const usersData: usersInterface = {
        email: "",
        isAdmin: false,
        uid: "",
        name: "",
      };
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const { email, isAdmin, uid, name } = data;
        usersData.email = email;
        usersData.isAdmin = isAdmin;
        usersData.uid = uid;
        usersData.name = name;
      });
      return usersData;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Invalid Email");
    }
  }
);

// logout action
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.clear();
      await auth.signOut();
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = error.message || "Failed to logout";
        return rejectWithValue(errorMessage);
      }
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "auth/fetchUserDetails",
  async () => {
    const uid = await new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          localStorage.setItem("token", user.refreshToken);
          resolve(user.uid);
        } else {
          localStorage.clear();
          resolve(null);
        }
      });
    });

    const collectionRef = collection(firestore, "users");
    const q = query(collectionRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const usersData: usersInterface = {
      email: "",
      isAdmin: false,
      uid: "",
      name: "",
    };
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { email, isAdmin, uid, name } = data;
      usersData.email = email;
      usersData.isAdmin = isAdmin;
      usersData.uid = uid;
      usersData.name = name;
    });
    return usersData;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = convertFirebaseErrorMessage(action.payload as string);
      })
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = convertFirebaseErrorMessage(action.payload as string);
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = convertFirebaseErrorMessage(action.payload as string);
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.user = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        action.payload && (state.usersList = action.payload);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
