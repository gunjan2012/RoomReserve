import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Box, Button, Container, Fade, Modal, Typography } from "@mui/material";
import { firestore } from "../../redux/hotelSlice";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { bookingsInterface, singleHotelDetails } from "../../types/types";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { calculateDuration } from "../../utils/dateMethods";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { putBookingsDetails } from "../../redux/actions/bookingActions";
import { modalStyle } from "../../styles/componentStyles";
import PaymentIcon from "@mui/icons-material/Payment";

interface propTypes {
  onClose(): void;
  isOpen: boolean;
  hotel: singleHotelDetails;
}

const PaymentForm = ({ isOpen, onClose, hotel }: propTypes) => {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: RootState) => state.auth.user);
  const bookingsArr: Array<bookingsInterface> = [];
  const navigate = useNavigate();
  const totalAmount =
    calculateDuration(hotel.checkIn, hotel.checkOut) *
    Number(hotel.details.data.rentPerDay);

  const bookingDetails: bookingsInterface = {
    uid: userData?.uid as string,
    hotelName: hotel.details.data.name,
    phoneNumber: hotel.details.data.phoneNumber,
    type: hotel.details.data.type,
    room_id: hotel.details.id,
    checkInDate: hotel.checkIn,
    checkOutDate: hotel.checkOut,
    totalAmount: totalAmount,
    totalDays: calculateDuration(hotel.checkIn, hotel.checkOut),
    userName: userData?.name as string,
    transaction_id: uuidv4(),
    location: hotel.details.data.location,
  };

  bookingsArr.push(bookingDetails);

  const addCurrentBookings = async () => {
    try {
      const docRef = doc(firestore, "rooms", hotel.details.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const existingBookings = docSnap.data().currentBookings || [];
        const updatedBookings = [...existingBookings, ...bookingsArr];

        await setDoc(
          docRef,
          { currentBookings: updatedBookings },
          { merge: true }
        );
      } else {
        throw new Error("Document doesn't exist.");
      }
    } catch (error) {
      console.error("Error updating array field:", error);
    }
  };

  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cardStyle = {
    base: {
      fontSize: "16px",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      color: "black",
      letterSpacing: "0.025em",
      "::placeholder": {
        color: "black",
      },
    },
    invalid: {
      color: "red",
    },
  };

  const handleBookings = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setLoading(false);
      return;
    }

    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setError(error.message as string);
      setTimeout(() => {
        setError(null);
      }, 2000);
      setLoading(false);
      return;
    }

    // Send the payment method to your server for processing
    addCurrentBookings();
    localStorage.removeItem("isDate");
    dispatch(putBookingsDetails(bookingDetails));
    toast.success("Room Booked Successfully ", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setLoading(false);
    setTimeout(() => {
      navigate("/profile");
    }, 1500);
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpen}
        onClose={onClose}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isOpen}>
          <Container sx={modalStyle}>
            <Typography
              variant="h5"
              sx={{ display: "flex", alignItems: "center", px: 10 }}
            >
              <PaymentIcon sx={{ fontSize: 28 }} />
              Payment Details
            </Typography>
            <Box sx={{ pt: 3 }}>
              <CardElement options={{ style: cardStyle }} />
            </Box>
            <Typography sx={{ pt: 3 }}>
              Amount:
              <Box component="span" pl="5px" color="red">
                &#8377;{totalAmount}
              </Box>
            </Typography>
            {error && <Typography color={"error"}>{error}</Typography>}
            <Box sx={{ pt: 3, display: "flex", justifyContent: "center" }}>
              <Button
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 4,
                  fontWeight: "bolder",
                }}
                variant="contained"
                disabled={!stripe || loading}
                onClick={handleBookings}
              >
                {loading ? "Processing..." : "Pay"}
              </Button>
              <Button
                variant="outlined"
                sx={{ ml: 2, fontWeight: "bolder" }}
                onClick={onClose}
              >
                Cancel
              </Button>
            </Box>
          </Container>
        </Fade>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default PaymentForm;
