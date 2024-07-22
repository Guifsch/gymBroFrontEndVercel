import React from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import IconButton from "@mui/material/IconButton";
import axiosConfig from "../utils/axios";
import { snackBarMessageSuccess, snackBarMessageError } from "../redux/snackbar/snackBarSlice";

function OAuth() {
  const dispatch = useDispatch();
  let history = useNavigate();
  const axiosInterceptor = axiosConfig();
const handleGoogleClick = async () => {
  try {
    // Cria uma nova instância do provedor de autenticação do Google
    const provider = new GoogleAuthProvider();
    // Obtém a instância de autenticação para o aplicativo Firebase
    const auth = getAuth(app);

    // Usa o popup para realizar a autenticação com o Google
    const result = await signInWithPopup(auth, provider);
    // Extrai os dados do usuário do resultado da autenticação
    const googleData = {
      name: result.user.displayName,
      email: result.user.email,
      photo: result.user.photoURL,
    };
 
    const response = await axiosInterceptor.post(
      `/api/auth/google`, 
      googleData, // Dados do usuário autenticado
      { withCredentials: true } 
    );

    dispatch(signInSuccess(response.data));
    dispatch(snackBarMessageSuccess("Conectado com sucesso!"));

    history("/home");
  } catch (e) {
    dispatch(snackBarMessageError("Oops, algo deu errado!"));
  }
};

  return (
      <div>
        <IconButton
          onClick={handleGoogleClick}
          aria-label="delete"
          size="small"
        >
          <GoogleIcon sx={{color: "#DB4437"}}  fontSize="small" />
        </IconButton>
      </div>
  );
}

export default OAuth;
