import React from "react";
import { useSelector } from "react-redux";
//Outlet mostra os componentes filhos / Navigate diferente do useNavigate que redireciona, é na verdade um componente que também redireciona
import { Outlet, Navigate } from "react-router-dom";
function PraviteRoute() {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser ? <Navigate to="/home" /> :  <Outlet />;
}

export default PraviteRoute;
