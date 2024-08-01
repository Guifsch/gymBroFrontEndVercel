import Calendar from "../components/Calendar";
import { CssBaseline, Box } from "@mui/material";
import Loading from "../components/Loading";
import React, { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosConfig from "../utils/axios";
import { snackBarMessageError } from "../redux/snackbar/snackBarSlice";

export default function Workouts() {
  const axiosInterceptor = axiosConfig();
  const [sets, setSets] = useState([]);
  const dispatch = useDispatch();

  const getSets = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(`/api/set/sets`, {
        withCredentials: true,
      });
      setSets(response.data);
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    }
  }, []);

  // useEffect para buscar os exercícios quando o componente é montado
  useEffect(() => {
    getSets();
  }, [getSets]);

  return (
    <Box className="flex flex-col justify-initial items-center pageMarginTopNavFix">
      <Loading />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "initial",
          width: "100%",
          maxWidth: "1200px",
          marginTop: "40px",
        }}
      >
        <CssBaseline />
        <Calendar sets={sets} sx={{ width: "100%" }} />
      </Box>
    </Box>
  );
}
