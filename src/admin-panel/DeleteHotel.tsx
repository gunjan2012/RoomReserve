import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { deleteHotelAction } from "../redux/actions/hotelActions";

interface propsType {
  onCancel(): void;
  hotelId: string;
}

const DeleteHotel = ({ onCancel, hotelId }: propsType) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = () => {
    onCancel();
    dispatch(deleteHotelAction(hotelId));
  };

  return (
    <>
      <Typography>Are you sure want to delete hotel?</Typography>
      <Box sx={{ pt: 5 }} display={"flex"}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ ml: 2 }}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>
    </>
  );
};

export default DeleteHotel;
