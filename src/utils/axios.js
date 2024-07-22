import axios from "axios";
import { useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { snackBarMessageError } from "../redux/snackbar/snackBarSlice";

const axiosConfig = () => {
  let history = useNavigate();
  const dispatch = useDispatch();

  // const axiosClient = axios.create({
  //   baseURL: "https://gym-bro-backend.vercel.app",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });

  const axiosClient = axios.create({
    baseURL: import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_BASE_URL_PROD
      : import.meta.env.VITE_BASE_URL_DEV,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // const axiosClient = axios.create({
  //   baseURL: "http://localhost:3000",
  //   timeout: 5000,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });

 axiosClient.interceptors.request.use(
    (config) => {
      console.log(config, "interceptor response Response");
      return config;
    },
    (error) => {
      console.log(error)
      Promise.reject(error);
    }
  );
  axiosClient.interceptors.response.use(
    (response) => {
      console.log(response, "interceptor request Config");
      return response;
    },
    (error) => {
    
      if (!error.response) {
        dispatch(snackBarMessageError("Ops, ocorreu um erro, verifique sua conexão!"));
        dispatch(signOut());
      }
      else if (error.response.statusText === "Unauthorized" || error.response.statusText === "Not Found" || error.response.data.error === "Você não está autentificado!") {
        dispatch(snackBarMessageError(error.response.data.error))
        console.log(error, "interceptor response Error");
        history("/");
      
        dispatch(signOut());
       
      }
      console.log(error, "interceptor request Error")
      return Promise.reject(error);
    }
  );
  return axiosClient;
};

export default axiosConfig;
