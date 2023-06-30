import {
  Button,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  cancelBooking,
  fetchUserBookings,
} from "../redux/actions/bookingActions";
import { useEffect } from "react";
import { bolder } from "../styles/componentStyles";

const BookingDetailsTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const bookingsDetails = useSelector((state: RootState) => state.bookings);
  const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const handleCancelBooking = (
    bookId: string,
    transId: string,
    roomId: string,
    userId: string
  ) => {
    dispatch(cancelBooking({ bookId, transId, roomId, userId }));
  };

  useEffect(() => {
    dispatch(fetchUserBookings(uid as string));
  }, [dispatch, uid]);

  if (bookingsDetails.loading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton variant="text" width={100} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={100} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={100} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={100} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={100} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={100} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({
              length: bookingsDetails.singleUserBookings.length,
            }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer
      sx={{
        maxHeight: { xs: "66vh", lg: "68vh" },
        overflowY: "auto",
        flexGrow: 1,
      }}
    >
      <Table>
        <TableHead
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            backgroundColor: "primary.light",
          }}
        >
          <TableRow>
            <TableCell sx={bolder}>Hotel</TableCell>
            <TableCell sx={bolder}>Location</TableCell>
            <TableCell sx={bolder}>Check-In</TableCell>
            <TableCell sx={bolder}>Check-Out</TableCell>
            <TableCell sx={bolder}>Total Days</TableCell>
            <TableCell sx={bolder}>Amount (&#8377;)</TableCell>
            <TableCell sx={bolder}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookingsDetails.singleUserBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.data.hotelName}</TableCell>
              <TableCell>{booking.data.location}</TableCell>
              <TableCell>{booking.data.checkInDate}</TableCell>
              <TableCell>{booking.data.checkOutDate}</TableCell>
              <TableCell>{booking.data.totalDays}</TableCell>
              <TableCell>{booking.data.totalAmount} &#8377;</TableCell>
              <TableCell>
                <Button
                  color="error"
                  onClick={() =>
                    handleCancelBooking(
                      booking.id,
                      booking.data.transaction_id,
                      booking.data.room_id,
                      booking.data.uid
                    )
                  }
                >
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookingDetailsTable;
