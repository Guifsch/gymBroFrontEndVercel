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
import { Box, TextField, CardMedia, Typography } from "@mui/material";

import CustomaizedButton from "../components/Button";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import backgroundImage from "../assets/login_background_images/background-circle.png";
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
    <Box
      className="flex justify-center items-center h-screen"
      sx={{ background: "-webkit-linear-gradient(bottom, #0250c5, #250039)" }}
    >
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
          pt: 10,
          zIndex: 1,
          margin: "25px",
          boxShadow: "5px 5px 15px 1px",
          borderRadius: "5px",
          position: "relative",
          overflow: "overlay",
          width: "450px",
          height: "650px",
          "@media (max-width:600px)": {
            width: "100%",
            height: "600px",
            pt: 5,
          },
          "@media (max-height:650px)": {
            maxHeight: "400px",
            pb: 5,
          },
        }}
      >
        <Loading top="0" />
        <Typography variant="h4" textAlign="center" sx={{ fontWeight: "bold" }}>
          Login
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 3,
            width: "80%",
          }}
        >
          <EmailIcon
            sx={{
              color: "action.active",
              mr: 1,
              my: 0.5,
              width: "1.3em",
              height: "1.3em",
            }}
          />
          <TextField
            onChange={handleChange}
            type="email"
            id="email"
            label="Email"
            variant="filled"
            required
            autoComplete="on"
            sx={{
              width: "100%",
              "& .MuiFormLabel-asterisk": {
                display: "none",
              },
            }}
          />
        </Box>

        <Box
          sx={{ display: "flex", alignItems: "center", mt: 3, width: "80%" }}
        >
          <LockIcon
            sx={{
              color: "action.active",
              mr: 1,
              my: 0.5,
              width: "1.3em",
              height: "1.3em",
            }}
          />
          <TextField
            onChange={handleChange}
            type="password"
            id="password"
            required
            label="Password"
            variant="filled"
            autoComplete="off"
            sx={{
              width: "100%",
              "& .MuiFormLabel-asterisk": {
                display: "none",
              },
            }}
          />
        </Box>

        <CustomaizedButton
          color="#491290"
          text="Entrar"
          width="80%"
          height="50px"
          margin="30px 0 0 0"
          type="submit"
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            width: "80%",
            paddingTop: "10px",
            transition: "0.2s",
            "&:hover": { color: "#044cbe;" },
          }}
        >
          <Link to="/forgot-password">Esqueceu sua senha?</Link>
        </Box>

        <Box sx={{ paddingTop: "30px" }}>ou conecte com o Google</Box>
        <OAuth></OAuth>
        <Box
          sx={{
            display: "flex",
            marginTop: "40px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          Você não possui uma conta?
          <Box
            sx={{
              color: "#044cbe",
              "&:hover": { color: "black" },
            }}
          >
            <Link to="/sign-up">Registre-se!</Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Signin;
