import {
  TextField,
  Button,
  Box,
  Container,
  IconButton,
  CardMedia,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import backgroundImage from "../assets/login_background_images/gym_background.jpg";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import axiosConfig from "../utils/axios";
import { useNavigate } from "react-router-dom";

import AccountCircle from "@mui/icons-material/AccountCircle";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";

function ForgotPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState({});
  const axiosInterceptor = axiosConfig();
  let history = useNavigate();
  const handleChange = (e) => {
    setEmail({ ...email, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loadingTrue());

    try {
      const response = await axiosInterceptor.post(
        "/api/reset/forgot-password",
        email
      );
      dispatch(snackBarMessageSuccess(response.data.message));
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    } finally {
      dispatch(loadingFalse());
    }
  };

  return (
    <Box className="flex justify-center items-center h-screen bg-slate-200">
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
          position: "relative",
          boxShadow: "5px 5px 15px 1px",
          borderRadius: "5%",
          width: "450px",
          overflow: "overlay",
          height: "600px",
          "@media (max-width:600px)": {
            width: "100%",
            height: "550px",
          },
          "@media (max-height:700px)": {
            maxHeight: '400px',
          },
        }}
      >
        <Loading top="0"/>
        <IconButton
          onClick={() => history(-1)}
          size="large"
          sx={{
            position: "absolute",
            top: "5px",
            left: "15px",
          }}
          aria-label="back"
          color="primary"
        >
          <KeyboardBackspaceIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="h4" textAlign="center">
          Esqueceu a senha?
        </Typography>
        <Typography variant="h8" textAlign="center" sx={{ mx: 5, mt: 3 }}>
        Digite seu endereço de e-mail para receber um link de redefinição de senha!
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
        ></Container>

        <Button
          sx={{
            my: 3,
          }}
          variant="contained"
          type="submit"
        >
          Enviar
        </Button>
      </Box>
    </Box>
  );
}

export default ForgotPassword;
