import {
  Container,
  Typography,
  Stack,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Box,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { calculateDuration } from "../utils/dateMethods";
import PaymentForm from "../components/payment-gateway/PaymentForm";
import StripeProvider from "../components/payment-gateway/StripeProvider";
import { useEffect, useState } from "react";
import { bolder } from "../styles/componentStyles";

const BookingDetails = () => {
  const location = useLocation();
  const hotelDetails = location.state;
  const totalDays = hotelDetails
    ? calculateDuration(hotelDetails.checkIn, hotelDetails.checkOut)
    : 0;
  const totalAmount = hotelDetails.details.data.rentPerDay * totalDays;
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const removeItem = () => {
      localStorage.removeItem("isDate");
    };

    window.addEventListener("popstate", removeItem);

    return () => window.removeEventListener("popstate", removeItem);
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Container>
        <Box sx={{ mt: 10, boxShadow: 10 }}>
          <Typography variant="h4" textAlign={"center"}>
            {hotelDetails.details.data.name}
          </Typography>
          <Grid
            container
            spacing={2}
            direction="row"
            alignItems={"center"}
            textAlign={"center"}
          >
            <Grid item xs={12} md={6} lg={6}>
              <Stack alignItems={"center"}>
                <Container sx={{ textAlign: "center" }}>
                  {hotelDetails.details.data.imgUrls.map(
                    (img: string, index: number) => (
                      <img
                        key={index}
                        style={{ margin: 3 }}
                        src={img}
                        alt="roomImage"
                        width={250}
                        height={200}
                      />
                    )
                  )}
                </Container>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Stack>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={bolder}>Description</TableCell>
                        <TableCell>
                          {hotelDetails.details.data.description}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={bolder}>Location</TableCell>
                        <TableCell>
                          {hotelDetails.details.data.location}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={bolder}>Phone</TableCell>
                        <TableCell>
                          {hotelDetails.details.data.phoneNumber}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={bolder}>Check-in date</TableCell>
                        <TableCell>{hotelDetails.checkIn}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={bolder}>Check-out date</TableCell>
                        <TableCell>{hotelDetails.checkOut}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={bolder}>Type</TableCell>
                        <TableCell>{hotelDetails.details.data.type}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={bolder}>Total Days</TableCell>
                        <TableCell>{totalDays}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={bolder}>Rent Per Day</TableCell>
                        <TableCell>
                          &#8377; {hotelDetails.details.data.rentPerDay}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={bolder}>Total Amount</TableCell>
                        <TableCell>&#8377; {totalAmount}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Box sx={{ paddingBottom: 2 }}>
                    <StripeProvider>
                      <Button
                        variant="contained"
                        onClick={handleOpenModal}
                        fullWidth
                      >
                        Book Now
                      </Button>
                      <PaymentForm
                        isOpen={modalOpen}
                        onClose={handleCloseModal}
                        hotel={hotelDetails}
                      />
                    </StripeProvider>
                  </Box>
                </TableContainer>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default BookingDetails;
