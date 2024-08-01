import {
  Button,
  Box,
  TextField,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import backgroundImage from "../assets/login_background_images/background-circle.png";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import axiosConfig from "../utils/axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomaizedButton from "../components/Button";
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
    <Box
      className="flex justify-center items-center h-screen bg-slate-200"
      sx={{ background: "-webkit-linear-gradient(bottom, #621c67, #250039)" }}
    >
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
          borderRadius: "5px",
          width: "450px",
          overflow: "overlay",
          height: "600px",
          "@media (max-width:600px)": {
            width: "100%",
            height: "550px", // Ajuste para telas menores
          },
          "@media (max-height:600px)": {
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
        <Typography variant="h4" textAlign="center" sx={{ fontWeight: "bold" }}>
          Registre-se!
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
          <AccountCircle
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
            type="username"
            id="username"
            label="Nome"
            required
            variant="filled"
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
            required
            label="Email"
            variant="filled"
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
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 3,
            width: "80%",
          }}
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
            label="Senha"
            variant="filled"
            autoComplete="on"
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
          text="Registrar"
          width="80%"
          height="50px"
          margin="30px 0 0 0"
          type="submit"
        />
        <Box sx={{ paddingTop: "30px" }}>ou conecte com o Google</Box>
        <OAuth></OAuth>
      </Box>
    </Box>
  );
}

export default Signup;
