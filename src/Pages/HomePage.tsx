import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Modal,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { FirestoreDocument, HotelDataInterface } from "../types/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import HotelIcon from "@mui/icons-material/Hotel";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { carouselImages } from "../utils/carouselImages";
import { formattedDateString, isDateBetween } from "../utils/dateMethods";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import PhoneIcon from "@mui/icons-material/Phone";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PlaceIcon from "@mui/icons-material/Place";
import LoadingSkeleton from "../components/LoadingSkeleton";
import SearchIcon from "@mui/icons-material/Search";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
  modalStyle,
} from "../styles/componentStyles";
import explore from "../assets/explore.png";
import hotel from "../assets/hotel.png";
import Footer from "./Footer";
import HotelDetails from "./HotelDetails";

const HomePage = () => {
  const hotels = useSelector((state: RootState) => state.hotels);
  const userDetails = useSelector((state: RootState) => state.auth.user);

  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState(hotels.hotelsData);
  const [rooms, setRooms] = useState<FirestoreDocument<HotelDataInterface>[]>(
    []
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);
  const [hotelDetails, setHotelDetails] = useState<HotelDataInterface | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const uid = userDetails?.uid as string;
  const isLoading = hotels.loading;
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setFilteredData(hotels.hotelsData);
  }, [setFilteredData, hotels.hotelsData]);

  const handleCheckIn = (date: string | null) => {
    if (date as string) {
      setCheckIn(dayjs(date).format("DD-MM-YYYY"));
    }
  };

  const handleCheckOut = (date: string | null) => {
    if (date as string) {
      setCheckOut(dayjs(date).format("DD-MM-YYYY"));
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const filtered = (rooms.length === 0 ? hotels.hotelsData : rooms).filter(
      (item) =>
        item.data.name.toLowerCase().includes(value.toLowerCase()) ||
        item.data.location.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDetails = (hotelData: HotelDataInterface) => {
    setModalOpen(true);
    setActionType("details");
    setHotelDetails(hotelData);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // filter hotels by selecting dates
  const handleButtonClick = () => {
    if (checkIn && checkOut) {
      if (
        moment(formattedDateString(checkOut)).isSameOrAfter(
          moment(formattedDateString(checkIn))
        )
      ) {
        localStorage.setItem("isDate", "true");
        const tempRooms: FirestoreDocument<HotelDataInterface>[] = [];
        let availability = false;
        for (const room of filteredData) {
          const currentBookingsLength = room.data.currentBookings.length;
          if (currentBookingsLength > 0) {
            const firstCheckIn = room.data.currentBookings[0].checkInDate;
            const lastCheckOut =
              room.data.currentBookings[currentBookingsLength - 1].checkOutDate;
            for (const booking of room.data.currentBookings) {
              const bookingStartDate = booking.checkInDate;
              const bookingEndDate = booking.checkOutDate;
              if (
                !isDateBetween(
                  checkIn as string,
                  bookingStartDate,
                  bookingEndDate
                ) &&
                !isDateBetween(
                  checkOut as string,
                  bookingStartDate,
                  bookingEndDate
                ) &&
                checkIn !== bookingStartDate &&
                checkIn !== bookingEndDate &&
                checkOut !== bookingStartDate &&
                checkOut !== bookingEndDate
              ) {
                if (
                  !isDateBetween(
                    checkIn as string,
                    firstCheckIn,
                    lastCheckOut
                  ) &&
                  !isDateBetween(checkOut as string, firstCheckIn, lastCheckOut)
                ) {
                  availability = true;
                }
              }
            }
          }
          if (availability === true || room.data.currentBookings.length === 0) {
            tempRooms.push({ id: room.id, data: room.data });
          }
          setRooms(tempRooms);
          setFilteredData(tempRooms);
        }
      } else {
        toast.error("invalid Dates Selected...!!");
      }
    } else {
      toast.error("Please Select Dates...!!");
    }
  };

  const handleClick = (hotelData: FirestoreDocument<HotelDataInterface>) => {
    if (!uid) {
      setOpen(true);
    } else {
      navigate("/booking", {
        state: {
          checkIn: checkIn,
          checkOut: checkOut,
          details: hotelData,
        },
      });
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* Carousel */}
        <Container sx={{ mt: 15 }}>
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
          >
            {carouselImages.map((imgUrl, index) => (
              <SwiperSlide key={index}>
                <img src={imgUrl} alt="carousel-image" className="fluid" />
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
        {/* Check Availability form */}
        <Container>
          <Grid
            sx={{
              borderRadius: 2,
              boxShadow: 4,
              padding: "2rem",
            }}
          >
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <DatePicker
                  disablePast
                  label="Check-in"
                  format="DD-MM-YYYY"
                  onChange={(date: string | null) => {
                    handleCheckIn(date);
                  }}
                />
              </Grid>
              <Grid item>
                <DatePicker
                  disablePast
                  label="Check-out"
                  format="DD-MM-YYYY"
                  onChange={(date: string | null) => {
                    handleCheckOut(date);
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  onClick={handleButtonClick}
                  variant="contained"
                  color="primary"
                >
                  Check Availability
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <Stack alignItems="center" marginTop={3} pb={5}>
          <Box display={"flex"} alignItems={"center"} mb={2}>
            <img src={explore} alt="explore" width={35} />
            <Typography variant="h4" sx={{ mx: 2 }} component="span">
              Explore Hotels
            </Typography>
            <img src={hotel} alt="hotels" width={35} />
          </Box>
          <Container>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Search sx={{ width: "70%" }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  onChange={handleSearchChange}
                  placeholder="Search hotel…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Box>
            <Grid container spacing={5} justifyContent="center" pt={1}>
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                filteredData.map((hotel, key) => (
                  <Grid item key={key}>
                    <Card sx={{ maxWidth: 300, height: 400 }}>
                      <CardMedia
                        component="img"
                        style={{ minWidth: 300, height: 200 }}
                        alt="green iguana"
                        image={hotel.data.imgUrls[0]}
                      />

                      <CardContent sx={{ pb: 0 }}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <HotelIcon sx={{ mr: 1 }} /> {hotel.data.name}
                        </Typography>
                        <Typography component="div" fontWeight={"bold"}>
                          {hotel.data.type}
                        </Typography>
                        <Typography
                          component="div"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <PhoneIcon sx={{ fontSize: 16, mr: 1 }} />
                          {hotel.data.phoneNumber}
                        </Typography>
                        <Typography
                          component="div"
                          color="red"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <CurrencyRupeeIcon sx={{ fontSize: 16, mr: 1 }} />
                          {hotel.data.rentPerDay}
                        </Typography>
                        <Typography
                          component="div"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <PlaceIcon sx={{ fontSize: 16, mr: 1 }} />
                          {hotel.data.location}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="outlined"
                          size="medium"
                          sx={{ fontWeight: "bold" }}
                          onClick={() => handleDetails(hotel.data)}
                        >
                          view details
                        </Button>
                        {rooms.length > 0 && (
                          <Button
                            variant="outlined"
                            size="medium"
                            sx={{ fontWeight: "bold" }}
                            onClick={() => handleClick(hotel)}
                          >
                            Book Now
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Container>
        </Stack>
        {/* hotel details modal */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          closeAfterTransition
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Container sx={modalStyle}>
            <Button
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                right: 0,
                top: "12px",
              }}
            >
              <CloseIcon sx={{ fontSize: 30 }} />
            </Button>
            {actionType === "details" && (
              <>
                <HotelDetails
                  hotelDetails={hotelDetails as HotelDataInterface}
                />
              </>
            )}
          </Container>
        </Modal>
        {/* when user access booking details page without signin */}
        <Dialog
          open={open}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Login Required...!"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              You need to log in to book this hotel.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Link to="/login">
              <Button variant="contained" onClick={handleClose}>
                Login
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Footer />
    </>
  );
};

export default HomePage;
