import {
  Box,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
import { HotelDataInterface } from "../types/types";

interface propTypes {
  hotelDetails: HotelDataInterface;
}

const HotelDetails = ({ hotelDetails }: propTypes) => {
  return (
    <>
      <Container>
        <Typography variant="h6" fontWeight={"bolder"} textAlign={"center"}>
          {hotelDetails.name}
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
                <Swiper
                  spaceBetween={30}
                  centeredSlides={true}
                  autoplay={{
                    delay: 1500,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Autoplay, Navigation]}
                  className="mySwiper hotel-images"
                >
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    {hotelDetails.imgUrls.map((img: string, index: number) => (
                      <SwiperSlide className="swiper-slide" key={index}>
                        <img src={img} alt="img" className="fluid" />
                      </SwiperSlide>
                    ))}
                  </Box>
                </Swiper>
              </Container>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Stack>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>
                        <Typography
                          sx={{ overflowY: "auto", maxHeight: { xs: 100 } }}
                          gutterBottom
                        >
                          {hotelDetails.description}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Location</TableCell>
                      <TableCell>
                        <Typography gutterBottom>
                          {hotelDetails.location}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Phone</TableCell>
                      <TableCell>
                        <Typography gutterBottom>
                          {hotelDetails.phoneNumber}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>
                        <Typography gutterBottom>
                          {hotelDetails.type}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Rent Per Day</TableCell>
                      <TableCell>
                        <Typography gutterBottom>
                          &#8377; {hotelDetails.rentPerDay}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default HotelDetails;
