import {
  Snackbar,
  Alert,
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

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const axiosInterceptor = axiosConfig();
  let history = useNavigate();
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInterceptor.post("/api/forgot-password", { email });
      setSnackbarSeverity("success");
      setSnackbarMessage("E-mail de redefinição enviado com sucesso!");
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(
        error.response.data.message || "Erro ao enviar o e-mail de redefinição."
      );
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
          height: "600px",
          "@media (max-width:600px)": {
            width: "100%",
            height: "550px", // Ajuste para telas menores
          },
        }}
      >
        <Loading top="0" width="90%" />
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
        <Typography variant="h8" textAlign="center" sx={{mx: 5, mt: 3}}>
          Digite seu email e enviaremos instruções para resetar sua senha!
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

export default ResetPassword;
