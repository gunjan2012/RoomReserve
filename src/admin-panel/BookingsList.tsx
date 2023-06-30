import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import SearchIcon from "@mui/icons-material/Search";
import { FirestoreDocument } from "../types/types";
import { bookingsInterface } from "../types/types";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../styles/componentStyles";

const propertyMapping: Record<string, keyof bookingsInterface> = {
  userName: "userName",
  hotelName: "hotelName",
  type: "type",
  checkInDate: "checkInDate",
  checkOutDate: "checkOutDate",
  totalAmount: "totalAmount",
};

const BookingsList = () => {
  const bookingsData = useSelector(
    (state: RootState) => state.bookings.bookingsData
  );
  const [filteredData, setFilteredData] = useState(bookingsData);
  const [valueToOrderBy, setValueToOrderBy] = useState<string>("");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setFilteredData(bookingsData);
  }, [setFilteredData, bookingsData]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    const filtered = bookingsData.filter(
      (item) =>
        item.data.hotelName.toLowerCase().includes(value.toLowerCase()) ||
        item.data.userName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAscending = valueToOrderBy === property && orderDirection === "asc";
    const newOrderDirection = isAscending ? "desc" : "asc";
    setValueToOrderBy(property);
    setOrderDirection(newOrderDirection);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = (a as FirestoreDocument<bookingsInterface>).data;
    const bValue = (b as FirestoreDocument<bookingsInterface>).data;
    const property = propertyMapping[valueToOrderBy];
    if (aValue[property] < bValue[property]) {
      return orderDirection === "asc" ? -1 : 1;
    }
    if (aValue[property] > bValue[property]) {
      return orderDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const tableHeader = [
    { id: "userName", label: "User" },
    { id: "hotelName", label: "Hotel" },
    { id: "type", label: "Type" },
    { id: "checkInDate", label: "Check-in Date" },
    { id: "checkOutDate", label: "Check-out Date" },
    { id: "totalAmount", label: "Amount" },
  ];

  return (
    <>
      <Container>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            onChange={handleSearchChange}
            placeholder="Search booking…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: { xs: "64vh", lg: "68vh" },
            overflowY: "auto",
            mt: 1,
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead
              sx={{
                position: "sticky",
                top: 0,
                background: "white",
                zIndex: 10,
                backgroundColor: "primary.light",
              }}
            >
              <TableRow>
                {tableHeader.map((header) => (
                  <TableCell key={header.id} sx={{ fontWeight: "bolder" }}>
                    <TableSortLabel
                      active={valueToOrderBy === header.id}
                      direction={
                        valueToOrderBy === header.id ? orderDirection : "asc"
                      }
                      onClick={(event) => handleSort(event, header.id)}
                    >
                      {header.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((booking) => (
                <TableRow
                  key={booking.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {booking.data.userName}
                  </TableCell>
                  <TableCell>{booking.data.hotelName}</TableCell>
                  <TableCell>{booking.data.type}</TableCell>
                  <TableCell>{booking.data.checkInDate}</TableCell>
                  <TableCell>{booking.data.checkOutDate}</TableCell>
                  <TableCell>&#8377; {booking.data.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default BookingsList;
