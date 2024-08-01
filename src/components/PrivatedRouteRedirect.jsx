import React, { useEffect } from "react";
import { useSelector } from "react-redux";
//Outlet mostra os componentes filhos / Navigate diferente do useNavigate que redireciona, é na verdade um componente que também redireciona
import { Outlet, Navigate } from "react-router-dom";
import {
  snackBarMessageError,
  snackBarMessageSuccess,
} from "../redux/snackbar/snackBarSlice";
import { useDispatch } from "react-redux";

function PraviteRoute() {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const { snackBarMessageLogout } = useSelector((state) => state.user);
  useEffect(() => {
    if (snackBarMessageLogout) {
      //Para surgir a mensagem 'desconectado' ao invés de 'você não está autentificado' ao dar logout
      dispatch(snackBarMessageSuccess("Desconectado com sucesso!"));
    } else if (!currentUser) {
      dispatch(snackBarMessageError("Você não está autentificado!"));
    }
  }, [currentUser]);
  return currentUser ? <Outlet /> : <Navigate to="/" />;
}

export default PraviteRoute;
