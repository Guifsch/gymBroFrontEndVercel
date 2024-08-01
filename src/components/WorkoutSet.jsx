import ModalWorkoutSet from "./ModalWorkoutSet";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";
import CustomaizedButton from "../components/Button";
import { Container, Box, Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import React, { useCallback, useState, useEffect } from "react";
import axiosConfig from "../utils/axios";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";

export default function Workouts() {
  const axiosInterceptor = axiosConfig();
  const dispatch = useDispatch();
  const [openSerieModal, setOpenSerieModal] = React.useState(false);
  const [modalContentUpdate, setModalContentUpdate] = useState({
    name: "",
    comment: "",
    cardColor: "",
    textColor: "",
    selectedItems: [],
  });
  const [sets, setSets] = useState([]);
  const getSets = useCallback(async () => {
    dispatch(loadingTrue());
    try {
      const response = await axiosInterceptor.get(`/api/set/sets`, {
        withCredentials: true,
      });
      setSets(response.data);
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    } finally {
      dispatch(loadingFalse());
    }
  }, []);

  const deleteSet = async (e) => {
    dispatch(loadingTrue());
    try {
      const response = await axiosInterceptor.delete(
        `/api/set/delete/${e._id}`,
        { withCredentials: true }
      );
      dispatch(snackBarMessageSuccess(response.data.message));
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    } finally {
      dispatch(loadingFalse());
      getSets();
    }
  };

  useEffect(() => {
    getSets();
  }, [getSets]);

  const modalSetRefreshRef = () => {
    getSets();
  };

  const handleOpenSerieModalUpdate = (e) => {
    setModalContentUpdate(e);
    setOpenSerieModal(true);
  };

  const handleOpenSerieModal = (e) => {
    setOpenSerieModal(true);
  };

  const handleCloseSerieModal = () => {
    setModalContentUpdate({
      name: "",
      comment: "",
      cardColor: "",
      textColor: "",
      selectedItems: [],
    });
    setOpenSerieModal(false);
  };

  return (
    <Box className="flex flex-col justify-initial items-center">
      <CustomaizedButton
        onClick={handleOpenSerieModal}
        color="#491290"
        text="Enviar Set"
        width="150px"
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingLeft: "9.5%",
          width: "100%",
          pt: 3,
          "@media (max-width:1000px)": {
            paddingLeft: 0,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            flexWrap: "wrap",
            width: "100%",
            "@media (max-width:1000px)": {
              flexDirection: "column",
              alignItems: "center",
            },
          }}
        >
          {sets.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                borderRadius: "5px",
                border: "solid 2px",
                padding: "10px",
                width: "26%",
                alignItems: "center",
                justifyContent: "start",
                flexDirection: "column",
                margin: "2%",
                wordBreak: "break-word",
                cursor: "pointer",
                "@media (max-width:1000px)": {
                  width: "200px",
                },
              }}
            >
              <Box sx={{ mb: 1 }}>
                <CustomaizedButton
                  onClick={() => deleteSet(item)}
                  color="#bb0000"
                  text="Deletar"
                />
              </Box>
              <Container
                onClick={() => handleOpenSerieModalUpdate(item)}
                sx={{
                  border: "solid 1px",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: item.cardColor,
                  justifyContent: "start",
                  flexDirection: "column",
                  wordBreak: "break-word",
                  cursor: "pointer",
                }}
              >
                <Typography
                  type="text"
                  required
                  variant="h5"
                  autoComplete="on"
                  marginTop="10px"
                  sx={{ fontWeight: "bold", px: "15px", color: item.textColor }}
                >
                  {item.name}
                </Typography>
                <Typography
                  type="text"
                  required
                  variant="standard"
                  autoComplete="on"
                  marginY="10px"
                  sx={{ color: item.textColor }}
                >
                  {item.comment}
                </Typography>
              </Container>
            </Box>
          ))}
        </Box>
      </Box>
      <ModalWorkoutSet
        openSerieModal={openSerieModal}
        handleCloseSerieModal={handleCloseSerieModal}
        modalContentUpdate={modalContentUpdate}
        modalSetRefreshRef={modalSetRefreshRef}
      />
    </Box>
  );
}
