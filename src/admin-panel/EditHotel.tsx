import { Container } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { updateHotelAction } from "../redux/actions/hotelActions";
import { HotelDataInterface } from "../types/types";
import HotelForm from "./HotelForm";

interface propTypes {
  hotelId: string;
  onCancel(): void;
}

const EditHotel = ({ hotelId, onCancel }: propTypes) => {
  const dispatch = useDispatch<AppDispatch>();
  const hotelsList = useSelector((state: RootState) => state.hotels);
  const [{ data }] = hotelsList.hotelsData.filter(
    (hotel) => hotel.id === hotelId
  );
  const initialValues = data;

  const handleSubmit = (values: HotelDataInterface) => {
    dispatch(updateHotelAction({ editedData: values, id: hotelId }));
    onCancel();
  };
  return (
    <>
      <Container>
        <HotelForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      </Container>
    </>
  );
};

export default EditHotel;
