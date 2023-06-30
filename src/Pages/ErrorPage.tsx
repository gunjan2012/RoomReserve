import React from "react";
import { Box, Button, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import errorImage from "../assets/404_Error_Page.png";

const ErrorPage = () => {
  return (
    <>
      <Container sx={{ mt: 20, height: "73.7vh" }}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <img src={errorImage} alt="404-page-not-found" width={400} />
          <Link to="/">
            <Button>
              <ArrowBackIcon />
              Go Back
            </Button>
          </Link>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default ErrorPage;
