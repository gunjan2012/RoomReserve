import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { ChangeEvent, useState } from "react";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import CancelIcon from "@mui/icons-material/Cancel";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { HotelDataInterface } from "../types/types";

interface propTypes {
  onCancel?: { (): void };
  initialValues: HotelDataInterface;
  onSubmit: (
    values: HotelDataInterface,
    formikHelpers: FormikHelpers<HotelDataInterface>
  ) => void;
}

const HotelForm = ({ onCancel, initialValues, onSubmit }: propTypes) => {
  const [formDirty, setFormDirty] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(initialValues.imgUrls);
  const phoneRegExp = /^[6-9]\d{9}$/;

  // Handle images changes
  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    setFieldValue: (
      field: string,
      value: string[],
      shouldValidate?: boolean
    ) => void
  ) => {
    const files = Array.from(event.target.files as FileList);
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target && e.target.result) {
        const imageUrl = e.target.result as string;
        setImageUrls((prevUrls: string[]) => [...prevUrls, imageUrl]);
        setFormDirty(true);
        setFieldValue("imgUrls", [...imageUrls, imageUrl]);
      }
    };
    files.forEach((file) => reader.readAsDataURL(file));
  };

  // handle images cancel
  const handleCancelImage = (
    index: number,
    setFieldValue: (
      field: string,
      value: string[],
      shouldValidate?: boolean
    ) => void,
    values: HotelDataInterface
  ) => {
    const updatedImages = [...values.imgUrls];
    updatedImages.splice(index, 1);
    setImageUrls(updatedImages);
    setFieldValue("imgUrls", updatedImages);
    setFormDirty(true);
  };

  // handle validation
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required!"),
    description: Yup.string().required("Description is required!"),
    rentPerDay: Yup.string().required("Rent is required!"),
    phoneNumber: Yup.string()
      .required("Phone number is required!")
      .matches(
        phoneRegExp,
        "Invalid phone number. Please enter valid phone number!"
      ),
    maxCount: Yup.string().required("Occupency is required!"),
    type: Yup.string().required("Type is required!"),
    location: Yup.string().required("Location is required!"),
  });

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnMount
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} md={12} lg={6}>
                {/* Name */}
                <Field
                  name="name"
                  as={TextField}
                  label="Name"
                  variant="outlined"
                  placeholder="Enter Hotel Name"
                  onChange={props.handleChange}
                  error={props.touched.name && Boolean(props.errors.name)}
                  helperText={props.touched.name && props.errors.name}
                  required
                  fullWidth
                />

                {/* Rent */}
                <Field
                  onChange={props.handleChange}
                  as={TextField}
                  sx={{ marginTop: 3, width: "100%" }}
                  label="Rent Per Day"
                  name="rentPerDay"
                  placeholder="Enter Rent"
                  autoComplete="off"
                  variant="outlined"
                  error={
                    props.touched.rentPerDay && Boolean(props.errors.rentPerDay)
                  }
                  helperText={
                    props.touched.rentPerDay && props.errors.rentPerDay
                  }
                  required
                />

                {/* Description */}
                <Field
                  onChange={props.handleChange}
                  as={TextField}
                  sx={{ marginTop: 3, width: "100%" }}
                  label="Description"
                  name="description"
                  placeholder="Enter Description"
                  autoComplete="off"
                  variant="outlined"
                  error={
                    props.touched.description &&
                    Boolean(props.errors.description)
                  }
                  helperText={
                    props.touched.description && props.errors.description
                  }
                  required
                />

                {/* Phone */}
                <Field
                  onChange={props.handleChange}
                  as={TextField}
                  sx={{ marginTop: 3, width: "100%" }}
                  label="Phone"
                  name="phoneNumber"
                  placeholder="Enter Phone"
                  autoComplete="off"
                  variant="outlined"
                  error={
                    props.touched.phoneNumber &&
                    Boolean(props.errors.phoneNumber)
                  }
                  helperText={
                    props.touched.phoneNumber && props.errors.phoneNumber
                  }
                  required
                />

                {/* location */}
                <Field
                  onChange={props.handleChange}
                  as={TextField}
                  sx={{ marginTop: 3, width: "100%" }}
                  label="location"
                  name="location"
                  placeholder="Enter location"
                  autoComplete="off"
                  variant="outlined"
                  error={
                    props.touched.location && Boolean(props.errors.location)
                  }
                  helperText={props.touched.location && props.errors.location}
                  required
                />
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                {/* Occupency */}
                <Field
                  onChange={props.handleChange}
                  as={TextField}
                  sx={{ width: "100%" }}
                  label="Maximum Occupency"
                  name="maxCount"
                  placeholder="Enter Max Occupency"
                  variant="outlined"
                  error={
                    props.touched.maxCount && Boolean(props.errors.maxCount)
                  }
                  helperText={props.touched.maxCount && props.errors.maxCount}
                  required
                />

                {/* Hotel Type */}
                <FormControl
                  sx={{ mt: 3, width: "100%" }}
                  error={props.touched.type && Boolean(props.errors.type)}
                >
                  <InputLabel
                    htmlFor="hotelType"
                    color={props.errors.type ? "error" : "primary"}
                  >
                    Hotel Type *
                  </InputLabel>
                  <Field
                    onChange={props.handleChange}
                    sx={{ width: "100%" }}
                    name="type"
                    labelId="hotelType"
                    label="Hotel Type"
                    variant="outlined"
                    as={Select}
                    required
                  >
                    <MenuItem value="Deluxe">Deluxe</MenuItem>
                    <MenuItem value="Non-Deluxe">Non-Deluxe</MenuItem>
                  </Field>
                  <FormHelperText>
                    {props.touched.type && props.errors.type}
                  </FormHelperText>
                </FormControl>

                {/* Hotel Images */}

                <Typography sx={{ mt: 2 }}>Select Hotel Images:</Typography>

                <InputLabel
                  htmlFor="hotelImages"
                  sx={{
                    textAlign: "center",
                    border: 1,
                    borderStyle: "dashed",
                    background: "lightgrey",
                    cursor: "pointer",
                  }}
                >
                  <AddPhotoAlternateIcon />
                </InputLabel>
                <Field
                  label="hotelImages"
                  sx={{ width: "100%" }}
                  type="file"
                  id="hotelImages"
                  name="hotelImages"
                  accept="image/*"
                  className="display-contents"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleFileChange(event, props.setFieldValue)
                  }
                  multiple
                />

                {/* Preview Images */}
                <Typography sx={{ mt: 2 }}>Image Preview:</Typography>
                <Box
                  sx={{
                    height: 125,
                    display: "flex",
                    alignItems: "center",
                    border: 1,
                    borderColor: "lightgrey",
                    borderRadius: 2,
                    maxWidth: "80rem",
                    overflowX: "auto",
                    overflowY: "hidden",
                  }}
                >
                  {props.values.imgUrls.map((url, index) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      key={index}
                    >
                      <Box width={120} height={100} p={1} mt={4} display="flex">
                        <img
                          width={120}
                          className="fluid"
                          src={url}
                          alt={`Image ${index}`}
                        />
                      </Box>
                      <Button
                        sx={{ bottom: 110, left: 50 }}
                        className="display-content"
                        onClick={() =>
                          handleCancelImage(
                            index,
                            props.setFieldValue,
                            props.values
                          )
                        }
                      >
                        <CancelIcon />
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
            <Box mt={2}>
              {onCancel ? (
                <>
                  <Button onClick={() => onCancel()}>Cancel</Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!props.dirty && !formDirty}
                  >
                    Update
                  </Button>
                </>
              ) : (
                <Button
                  type="submit"
                  sx={{
                    marginTop: 3,
                  }}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Add Hotel
                </Button>
              )}
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default HotelForm;
