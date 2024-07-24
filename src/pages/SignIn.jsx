import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";
import OAuth from "../components/OAuth";
import axiosConfig from "../utils/axios";
import {
  Button,
  Box,
  TextField,
  Typography,
  Container,
  CardMedia,
} from "@mui/material";

import gymBroLogoSvg from "../assets/icons/arm-logo-svg.svg";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";

import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import backgroundImage from "../assets/login_background_images/gym_background.jpg";
function Signin() {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  let history = useNavigate();
  const axiosInterceptor = axiosConfig();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loadingTrue());

    try {
      const response = await axiosInterceptor.post(
        "/api/auth/signin",
        formData,
        { withCredentials: true }
      );
      dispatch(signInSuccess(response.data)); //loading, error para false e o envio do action.payload vindo do userSlice
      dispatch(
        snackBarMessageSuccess("Bem vindo " + response.data.username + "!")
      );
      history("/home");
    } catch (error) {
      dispatch(snackBarMessageError(error.response.data.error));
    } finally {
      dispatch(loadingFalse());
    }
  };

  return (
    <Box className="flex justify-center items-center h-screen">
      <CardMedia
        sx={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          filter: "contrast(0.3)",
        }}
        component="img"
        image={backgroundImage}
        alt="Background-image"
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="start"
        onSubmit={handleSubmit}
        flexDirection="column"
        component="form"
        sx={{
          backgroundColor: "white",
          zIndex: 1,
          margin: "25px",
          boxShadow: "5px 5px 15px 1px",
          borderRadius: "5%",
          position: "relative",
          overflow: "overlay",
          width: "450px",
          height: "650px",
          "@media (max-width:600px)": {
            width: "100%",
            height: "600px",
            pt: 2,
          },
          "@media (max-height:700px)": {
            maxHeight: '400px',
            pb: 3
          },
        }}
      >
        <Loading top="0" />
        <CardMedia
          sx={{
            my: 3,
            width: "3em",
            height: "3em",
            display: "inline-block",
            fontSize: "1.5rem",
          }}
          component="img"
          image={gymBroLogoSvg}
        />
        <Typography variant="h4" textAlign="center">
          Bem vindo!
        </Typography>
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              onChange={handleChange}
              type="email"
              required
              id="email"
              label="Email"
              variant="standard"
              autoComplete="on"
            />
          </Box>
        </Container>
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <LockIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              onChange={handleChange}
              type="password"
              required
              id="password"
              label="Password"
              variant="standard"
              autoComplete="off"
            />
          </Box>
        </Container>

        <Box
          className="text-sm font-medium text-gray-900 dark:text-gray-300
          "
          sx={{
            display: "flex",
            marginTop: "50px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          Você não possui uma conta?
          <Link to="/sign-up" className="text-blue-500 ml-1">
            Registre-se!
          </Link>
        </Box>
        <Box
          className="text-sm font-medium text-gray-900 dark:text-gray-300
          "
          sx={{
            display: "flex",
            marginTop: "30px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Link to="/forgot-password" className="text-blue-500 ml-1">
            Esqueceu sua senha?
          </Link>
        </Box>

        <Button
          sx={{
            my: 3,
          }}
          variant="contained"
          type="submit"
        >
          Entrar
        </Button>
        <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
          ou conecte com o Google
        </div>
        <OAuth></OAuth>
      </Box>
    </Box>
  );
}

export default Signin;
