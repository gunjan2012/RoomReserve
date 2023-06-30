import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import BookingDetailsTable from "./BookingDetailsTable";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const UserProfile = () => {
  const userDetails = useSelector((state: RootState) => state.auth.user);

  return userDetails ? (
    <Container
      sx={{
        pt: 10,
        height: "92vh",
      }}
    >
      <Box>
        <Typography variant="h4">{userDetails.name}</Typography>
      </Box>
      <hr />
      <Box>
        <Typography variant="h5" sx={{ display: "flex", alignItems: "center" }}>
          Bookings Details <InfoOutlinedIcon sx={{ ml: 1 }} />
        </Typography>
        <BookingDetailsTable />
      </Box>
    </Container>
  ) : (
    <div>Loading...</div>
  );
};

export default UserProfile;
