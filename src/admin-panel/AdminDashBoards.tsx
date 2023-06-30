import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Container, Tab } from "@mui/material";
import React, { useState } from "react";
import HotelsList from "./HotelsList";
import AddHotelForm from "./AddHotelForm";
import BookingsList from "./BookingsList";
import UsersList from "./UsersList";
import { useNavigate } from "react-router-dom";

const AdminDashBoards = () => {
  const [value, setValue] = useState("1");
  const navigate = useNavigate();
  const routes = ["hotels", "add", "bookings", "users"];

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(routes[Number(newValue) - 1]);
  };

  return (
    <Container sx={{ mt: 10, height: "82.9vh" }}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Hotels" value="1" />
              <Tab label="Add Hotel" value="2" />
              <Tab label="Bookings" value="3" />
              <Tab label="Users" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <HotelsList />
          </TabPanel>
          <TabPanel value="2">
            <AddHotelForm />
          </TabPanel>
          <TabPanel value="3">
            <BookingsList />
          </TabPanel>
          <TabPanel value="4">
            <UsersList />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
};

export default AdminDashBoards;
