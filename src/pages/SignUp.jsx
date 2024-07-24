import {
  Button,
  Box,
  TextField,
  Container,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import backgroundImage from "../assets/login_background_images/gym_background.jpg";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import axiosConfig from "../utils/axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";

import OAuth from "../components/OAuth";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";

function Signup() {
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const dispatch = useDispatch();
  let history = useNavigate();
  const axiosInterceptor = axiosConfig();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loadingTrue());

    try {
      const response = await axiosInterceptor.post(
        "/api/auth/signup",
        formData
      );
      dispatch(snackBarMessageSuccess(response.data.message));
      history("/");
    } catch (error) {
      dispatch(snackBarMessageError(error.response.data.error));
    } finally {
      dispatch(loadingFalse());
    }
  };

  return (
    <Box className="flex justify-center items-center h-screen bg-slate-200">
      <CardMedia
        className=""
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
            height: "550px", // Ajuste para telas menores
          },
          "@media (max-height:700px)": {
            maxHeight: "400px",
            pb: 3,
          },
        }}
      >
        <Loading top="0" />
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
          Registre-se!
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
              type="username"
              required
              id="username"
              label="Nome"
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
              label="Senha"
              variant="standard"
              autoComplete="off"
            />
          </Box>
        </Container>

        <Button
          sx={{
            mt: 5,
            mb: 3,
          }}
          variant="contained"
          type="submit"
        >
          Registrar
        </Button>
        <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
          ou conecte com o Google
        </div>
        <OAuth></OAuth>
      </Box>
    </Box>
  );
}

export default Signup;
