export interface User {
  name: string;
  refreshToken: string;
  uid: string;
}

export interface AuthState {
  user: usersInterface | null;
  usersList: FirestoreDocument<usersInterface>[];
  loading: boolean;
  error: string | null;
}

export interface HotelDataInterface {
  name: string;
  description: string;
  rentPerDay: string;
  phoneNumber: string;
  type: string;
  maxCount: string;
  imgUrls: string[];
  currentBookings: bookingsInterface[];
  location: string;
}

export interface singleHotelDetails {
  checkIn: string;
  checkOut: string;
  details: FirestoreDocument<HotelDataInterface>;
}

export interface FirestoreDocument<T> {
  id: string;
  data: T;
}

export interface bookingsInterface {
  room_id: string;
  uid: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  totalDays: number;
  totalAmount: number;
  phoneNumber: string;
  userName: string;
  type: string;
  transaction_id: string;
  location: string;
}

export interface usersInterface {
  email: string;
  isAdmin: boolean;
  uid: string;
  name: string;
}

export interface stateObjectType {
  hotelsData: FirestoreDocument<HotelDataInterface>[];
  loading: boolean;
  error: string | null;
}

export interface bookingsStateType {
  bookingsData: FirestoreDocument<bookingsInterface>[];
  singleUserBookings: FirestoreDocument<bookingsInterface>[];
  loading: boolean;
  error: string | null;
}
