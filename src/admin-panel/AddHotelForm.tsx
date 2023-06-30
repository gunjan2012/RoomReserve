import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { HotelDataInterface } from "../types/types";
import { addHotelAction } from "../redux/actions/hotelActions";
import { Container } from "@mui/material";
import HotelForm from "./HotelForm";
import { FormikHelpers } from "formik";
import "react-toastify/dist/ReactToastify.css";

const AddHotelForm = () => {
  const dispatch = useDispatch<AppDispatch>();

  const initialValues: HotelDataInterface = {
    name: "",
    description: "",
    rentPerDay: "",
    phoneNumber: "",
    type: "",
    maxCount: "",
    imgUrls: [],
    currentBookings: [],
    location: "",
  };

  const handleSubmit = (
    values: HotelDataInterface,
    { resetForm }: FormikHelpers<HotelDataInterface>
  ) => {
    toast.success("Hotel Added Successfully");
    dispatch(addHotelAction(values));
    resetForm();
  };

  return (
    <>
      <Container sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        <HotelForm initialValues={initialValues} onSubmit={handleSubmit} />
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default AddHotelForm;
