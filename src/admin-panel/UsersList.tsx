import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import SearchIcon from "@mui/icons-material/Search";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../styles/componentStyles";

const UsersList = () => {
  const usersList = useSelector((state: RootState) => state.auth.usersList);
  const [filteredData, setFilteredData] = useState(usersList);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    const filtered = usersList.filter(
      (item) =>
        item.data.name.toLowerCase().includes(value.toLowerCase()) ||
        item.data.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <>
      <Container>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            onChange={handleSearchChange}
            placeholder="Search user…"
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
                <TableCell sx={{ fontWeight: "bolder" }}>User</TableCell>
                <TableCell sx={{ fontWeight: "bolder" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bolder" }}>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((user, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.data.name}
                  </TableCell>
                  <TableCell>{user.data.email}</TableCell>
                  <TableCell>{user.data.isAdmin ? "Admin" : "User"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default UsersList;
