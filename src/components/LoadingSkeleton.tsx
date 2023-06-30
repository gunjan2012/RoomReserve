import { Card, Grid, Skeleton, Typography } from "@mui/material";
import React from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PlaceIcon from "@mui/icons-material/Place";
import HotelIcon from "@mui/icons-material/Hotel";

const LoadingSkeleton = () => {
  return (
    <>
      {Array.from({ length: 9 }).map((_, index) => (
        <Grid item key={index}>
          <Card sx={{ maxWidth: 300, height: 400 }}>
            <Skeleton
              variant="rectangular"
              animation={"wave"}
              width={300}
              height={200}
            />
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <HotelIcon sx={{ mr: 1 }} />
              <Skeleton width={"100%"} />
            </Typography>
            <Typography component="div" fontWeight={"bold"}>
              <Skeleton width={"100%"} />
            </Typography>
            <Typography
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <PhoneIcon sx={{ fontSize: 16, mr: 1 }} />
              <Skeleton width={"100%"} />
            </Typography>
            <Typography
              component="div"
              color="red"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <CurrencyRupeeIcon sx={{ fontSize: 16, mr: 1 }} />
              <Skeleton width={"100%"} />
            </Typography>
            <Typography
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <PlaceIcon sx={{ fontSize: 16, mr: 1 }} />
              <Skeleton width={"100%"} />
            </Typography>
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default LoadingSkeleton;
