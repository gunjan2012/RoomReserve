import { Box, Typography } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          bgcolor: "primary.main",
          color: "white",
          p: 3,
          position: "inherit",
          width: "100%",
        }}
      >
        <Typography variant="h5" sx={{ fontSize: { xs: "1rem", sm: "1rem" } }}>
          All Rights Reserved &copy; Gunjan Dalwadi
        </Typography>
      </Box>
    </>
  );
};

export default Footer;
