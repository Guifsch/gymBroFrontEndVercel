import {
  TextField,
  Button,
  Box,
  Container,
  CardMedia,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import backgroundImage from "../assets/login_background_images/gym_background.jpg";
import axiosConfig from "../utils/axios";
import { useNavigate, useSearchParams } from "react-router-dom";

import AccountCircle from "@mui/icons-material/AccountCircle";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";

function ResetPassword() {
  const dispatch = useDispatch();
  const [passwords, setPasswords] = useState({});
  const axiosInterceptor = axiosConfig();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const id= searchParams.get('id');
  let history = useNavigate();
  const handleChange = (e) => {
    console.log(passwords)
    setPasswords({ ...passwords, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 

    if (passwords.password !== passwords.confirmPassword) {
      dispatch(snackBarMessageError("As senhas não coincidem"));
      return;
    }

    try {
      dispatch(loadingTrue());
      const newpassword = passwords.password;
      const response = await axiosInterceptor.post(
        `/api/reset/reset-password?token=${token}&id=${id}`,
        {newPassword: newpassword}
      );
      history("/");
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
            pb: 3
          },
        }}
      >
        <Loading top="0"/>
        <Typography variant="h4" textAlign="center">
        Redefinir Senha
        </Typography>
        <Typography variant="h8" textAlign="center" sx={{ mx: 5, mt: 3 }}>
        Digite sua nova senha
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
              type="password"
              required
              id="password"
              label="Nova senha"
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
              type="password"
              required
              id="confirmPassword"
              label="Confirme a nova senha"
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
