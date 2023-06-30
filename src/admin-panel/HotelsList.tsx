import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  Button,
  Container,
  Modal,
  Skeleton,
  TableSortLabel,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteHotel from "./DeleteHotel";
import SearchIcon from "@mui/icons-material/Search";
import { FirestoreDocument, HotelDataInterface } from "../types/types";
import EditHotel from "./EditHotel";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
  modalStyle,
} from "../styles/componentStyles";

const HotelsList = () => {
  const hotelsList = useSelector((state: RootState) => state.hotels);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState(hotelsList.hotelsData);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [valueToOrderBy, setValueToOrderBy] = useState("");

  const propertyMapping: Record<string, keyof HotelDataInterface> = {
    name: "name",
    rentPerDay: "rentPerDay",
    phoneNumber: "phoneNumber",
    type: "type",
    maxCount: "maxCount",
    location: "location",
  };

  useEffect(() => {
    setFilteredData(hotelsList.hotelsData);
  }, [setFilteredData, hotelsList.hotelsData]);

  if (hotelsList.loading) {
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
            {Array.from({ length: hotelsList.hotelsData.length }).map(
              (_, index) => (
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
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  const handleOpenModal = (actionType: string, id: string) => {
    setModalOpen(true);
    setHotelId(id);
    setActionType(actionType);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    const filtered = hotelsList.hotelsData.filter(
      (item) =>
        item.data.name.toLowerCase().includes(value.toLowerCase()) ||
        item.data.location.toLowerCase().includes(value.toLowerCase()) ||
        item.data.rentPerDay.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const tableHeader = [
    { id: "name", label: "Hotel" },
    { id: "location", label: "Location" },
    { id: "maxCount", label: "Occupancy" },
    { id: "rentPerDay", label: "Rent Per Day" },
    { id: "phoneNumber", label: "Phone" },
    { id: "type", label: "Type" },
  ];

  const handleSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAscending = valueToOrderBy === property && orderDirection === "asc";
    const newOrderDirection = isAscending ? "desc" : "asc";
    setValueToOrderBy(property);
    setOrderDirection(newOrderDirection);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = (a as FirestoreDocument<HotelDataInterface>).data;
    const bValue = (b as FirestoreDocument<HotelDataInterface>).data;
    const property = propertyMapping[valueToOrderBy];
    if (aValue[property] < bValue[property]) {
      return orderDirection === "asc" ? -1 : 1;
    }
    if (aValue[property] > bValue[property]) {
      return orderDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          onChange={handleSearchChange}
          placeholder="Search hotel…"
          inputProps={{ "aria-label": "search" }}
        />
      </Search>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: { xs: "64vh", lg: "68vh" }, overflowY: "auto", mt: 1 }}
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
              {tableHeader.map((header, index) => (
                <TableCell sx={{ fontWeight: "bolder" }} key={index}>
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
              <TableCell sx={{ fontWeight: "bolder" }} align="center">
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bolder" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((hotel) => (
              <TableRow
                key={hotel.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {hotel.data.name}
                </TableCell>
                <TableCell>{hotel.data.location}</TableCell>
                <TableCell>{hotel.data.maxCount}</TableCell>
                <TableCell>&#8377; {hotel.data.rentPerDay}</TableCell>
                <TableCell>{hotel.data.phoneNumber}</TableCell>
                <TableCell>{hotel.data.type}</TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color:
                      hotel.data.currentBookings.length > 0 ? "red" : "green",
                  }}
                >
                  {hotel.data.currentBookings.length > 0
                    ? "Reserved"
                    : "Available"}
                </TableCell>
                <TableCell align="center">
                  <Button
                    sx={{ display: "contents" }}
                    onClick={() => handleOpenModal("edit", hotel.id)}
                  >
                    <EditOutlinedIcon
                      color="primary"
                      sx={{ cursor: "pointer" }}
                    />
                  </Button>
                  <Button
                    sx={{ display: "contents" }}
                    onClick={() => handleOpenModal("delete", hotel.id)}
                  >
                    <DeleteIcon color="primary" sx={{ cursor: "pointer" }} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
            {actionType === "edit" ? (
              <>
                <Typography variant="h4">Edit Hotel</Typography>
                <EditHotel
                  onCancel={() => handleCloseModal()}
                  hotelId={hotelId as string}
                />
              </>
            ) : (
              <DeleteHotel
                onCancel={handleCloseModal}
                hotelId={hotelId as string}
              />
            )}
          </Container>
        </Modal>
      </TableContainer>
    </>
  );
};

export default HotelsList;
