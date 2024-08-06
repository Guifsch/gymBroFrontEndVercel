import {
  TextField,
  Box,
  IconButton,
  CardMedia,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import backgroundImage from "../assets/login_background_images/background-circle.png";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import axiosConfig from "../utils/axios";
import { useNavigate } from "react-router-dom";
import CustomaizedButton from "../components/Button";
import EmailIcon from "@mui/icons-material/Email";
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
    <Box
      className="flex justify-center items-center h-screen bg-slate-200"
      sx={{ background: "-webkit-linear-gradient(bottom, #007726, #000000)" }}
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
          position: "relative",
          boxShadow: "5px 5px 15px 1px",
          borderRadius: "5px",
          width: "450px",
          overflow: "overlay",
          height: "600px",
          "@media (max-width:600px)": {
            width: "100%",
            height: "550px",
          },
          "@media (max-height:600px)": {
            maxHeight: "400px",
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
          Esqueceu a senha?
        </Typography>
        <Typography variant="h8" textAlign="center" sx={{ mx: 5, mt: 3 }}>
          Digite seu endereço de e-mail para receber um link de redefinição de
          senha!
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
            autoComplete="on"
            required
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
          text="Enviar"
          width="80%"
          height="50px"
          margin="30px 0 0 0"
          type="submit"
        />
      </Box>
    </Box>
  );
}

export default ForgotPassword;
