import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import PropTypes from "prop-types";
import { AppDispatch, RootState } from "../redux/store";
import * as Yup from "yup";
import usePasswordVisibilityToggle from "../components/custom-hooks/usePasswordVisibilityToggle";
import { signInUser } from "../redux/authSlice";
import { useEffect, useState } from "react";
import loginImage from "../assets/login.png";

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const { showPassword, passwordInputProps } = usePasswordVisibilityToggle();

  interface login {
    email: string;
    password: string;
  }

  const initialState: login = {
    email: "",
    password: "",
  };

  useEffect(() => {
    if (userAuth.error) {
      setLoading(false);
    }
  }, [userAuth.error]);

  const handleSubmit = (values: login) => {
    setLoading(true);
    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem("expirationTime", expirationTime.toString());
    dispatch(signInUser(values));
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required!"),
    password: Yup.string().required("Password is required!"),
  });

  return token ? (
    <Navigate to="/" />
  ) : (
    <>
      <Container sx={{ pt: { xs: 5, lg: 15 }, height: { md: "92vh" } }}>
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems={"center"}
          textAlign={"center"}
        >
          <Grid item xs={12} md={6} lg={6}>
            <Stack alignItems={"center"} padding={5}>
              <Avatar>
                <LockOutlinedIcon />
              </Avatar>
              <Typography variant="h4">Sign in</Typography>
              <Formik
                initialValues={initialState}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
              >
                {(props) => (
                  <Form onSubmit={props.handleSubmit}>
                    <Field
                      as={TextField}
                      name="email"
                      sx={{ marginTop: 5 }}
                      label="Email"
                      variant="standard"
                      placeholder="Enter Your Email"
                      autoComplete="on"
                      error={props.touched.email && Boolean(props.errors.email)}
                      helperText={props.touched.email && props.errors.email}
                      fullWidth
                      required
                    />
                    <Field
                      as={TextField}
                      name="password"
                      sx={{ marginTop: 3 }}
                      id="standard-password-input"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Your Password"
                      autoComplete="current-password"
                      variant="standard"
                      InputProps={passwordInputProps}
                      error={
                        props.touched.password && Boolean(props.errors.password)
                      }
                      helperText={
                        props.touched.password && props.errors.password
                      }
                      fullWidth
                      required
                    />
                    <Button
                      type="submit"
                      sx={{
                        marginTop: 3,
                      }}
                      variant="contained"
                      fullWidth
                    >
                      {loading ? "processing..." : "Sign in"}
                    </Button>
                  </Form>
                )}
              </Formik>
              <Typography marginTop={2}>
                Don't have an account? <Link to="/register">Signup</Link>
              </Typography>
              <Typography color="error">{userAuth.error}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <img className="fluid" src={loginImage} alt="login" width={500} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

LoginPage.propTypes = {
  handleSubmit: PropTypes.func,
};

export default LoginPage;
