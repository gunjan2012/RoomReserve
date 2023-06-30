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
import { Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../redux/authSlice";
import { AppDispatch, RootState } from "../redux/store";
import { Link, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import * as Yup from "yup";
import usePasswordVisibilityToggle from "../components/custom-hooks/usePasswordVisibilityToggle";
import { useEffect, useState } from "react";
import signupImage from "../assets/signup.png";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { showPassword, passwordInputProps } = usePasswordVisibilityToggle();

  const authState = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  interface formValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const initialValues: formValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = (values: formValues) => {
    setLoading(true);
    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem("expirationTime", expirationTime.toString());
    const { name, email, password } = values;
    dispatch(signUpUser({ email, password, name }));
  };

  useEffect(() => {
    if (authState.error) {
      setLoading(false);
    }
  }, [authState.error]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required!"),
    email: Yup.string().email("Invalid email").required("Email is required!"),
    password: Yup.string().required("Password is required!"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm password is required!"),
  });

  return !token ? (
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
              <Typography variant="h4">Sign Up</Typography>
              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
              >
                {(props) => (
                  <Form onSubmit={props.handleSubmit}>
                    <Field
                      sx={{ marginTop: 5 }}
                      name="name"
                      as={TextField}
                      label="Name"
                      variant="standard"
                      placeholder="Enter Your Name"
                      error={props.touched.name && Boolean(props.errors.name)}
                      helperText={props.touched.name && props.errors.name}
                      fullWidth
                      required
                    />
                    <Field
                      as={TextField}
                      sx={{ marginTop: 3 }}
                      name="email"
                      label="Email"
                      variant="standard"
                      placeholder="Enter Your Email"
                      error={props.touched.email && Boolean(props.errors.email)}
                      helperText={props.touched.email && props.errors.email}
                      fullWidth
                      required
                    />
                    <Field
                      as={TextField}
                      sx={{ marginTop: 3 }}
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Your Password"
                      autoComplete="off"
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
                    <Field
                      as={TextField}
                      sx={{ marginTop: 3 }}
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Your Password"
                      autoComplete="off"
                      variant="standard"
                      InputProps={passwordInputProps}
                      error={
                        props.touched.confirmPassword &&
                        Boolean(props.errors.confirmPassword)
                      }
                      helperText={
                        props.touched.confirmPassword &&
                        props.errors.confirmPassword
                      }
                      fullWidth
                      required
                    />
                    <Button
                      type="submit"
                      sx={{ marginTop: 3 }}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      {loading ? "processing..." : "Sign Up"}
                    </Button>
                  </Form>
                )}
              </Formik>
              <Typography marginTop={2}>
                Aleardy have an account? <Link to="/login">Login</Link>
              </Typography>
              <Typography color="error">{authState.error}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <img
              className="fluid"
              src={signupImage}
              alt="register"
              width={500}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  ) : (
    <Navigate to="/" />
  );
};

Register.propTypes = {
  handleSubmit: PropTypes.func,
};

export default Register;
