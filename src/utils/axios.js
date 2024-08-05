import axios from "axios";
import { useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { snackBarMessageError } from "../redux/snackbar/snackBarSlice";

const axiosConfig = () => {
  let history = useNavigate();
  const dispatch = useDispatch();

  const axiosClient = axios.create({
    baseURL:
      import.meta.env.MODE === "production"
        ? import.meta.env.VITE_BASE_URL_PROD
        : import.meta.env.VITE_BASE_URL_DEV,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosClient.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
  axiosClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (!error.response) {
        dispatch(
          snackBarMessageError("Ops, ocorreu um erro, verifique sua conexão!")
        );
        dispatch(signOut());
      } else if (
        error.response.statusText === "Unauthorized" ||
        error.response.statusText === "Not Found" ||
        error.response.data.error === "Você não está autentificado!"
      ) {
        dispatch(snackBarMessageError(error.response.data.error));

        history("/");

        dispatch(signOut());
      }
      return Promise.reject(error);
    }
  );
  return axiosClient;
};

export default axiosConfig;
