import ModalWorkoutSet from "./ModalWorkoutSet";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";
import CustomaizedButton from "../components/Button";
import { Container, Box, Typography, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import React, { useCallback, useState, useEffect } from "react";
import axiosConfig from "../utils/axios";
import ConfirmButtom from "../components/Confirm";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";

export default function Workouts() {
  const axiosInterceptor = axiosConfig();
  const dispatch = useDispatch();
  const [deleteBurronRef, setDeleteBurronRef] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
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

  const handleConfirmOpen = (e) => {
    setDeleteBurronRef(e);
    setConfirmDelete(true);
  };

  const handleConfirmClose = () => {
    setConfirmDelete(false);
  };

  const handleConfirmDelete = () => {
    setConfirmDelete(false);
    deleteSet(deleteBurronRef);
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
                  width: "500px",
                },
                "@media (max-width:500px)": {
                  width: "100%",
                },
              }}
            >
              <Box sx={{ mb: 1 }}>
                <CustomaizedButton
                  onClick={() => handleConfirmOpen(item)}
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
                  "@media (max-width:500px)": {
                    minHeight: "150px",
                  },
                }}
              >
                <Typography
                  type="text"
                  required
                  variant="h4"
                  autoComplete="on"
                  marginTop="10px"
                  sx={{ fontWeight: "bold", px: "15px", color: item.textColor }}
                >
                  {item.name}
                </Typography>

                <TextField
                  multiline
                  value={item.comment}
                  sx={{
                    width: "100%",
                    "& textarea": { color: item.textColor },
                    "& fieldset": { border: "none" },
                  }}
                />

                {/* <Typography
                  type="text"
                  required
                  variant="standard"
                  autoComplete="on"
                  marginY="10px"
                  sx={{ color: item.textColor }}
                >
                  {item.comment}
                </Typography> */}
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
      <ConfirmButtom
        text="Tem certeza que deseja deletar?"
        confirmDeleteOpen={confirmDelete}
        handleConfirmClose={handleConfirmClose}
        handleConfirmDelete={handleConfirmDelete}
      />
    </Box>
  );
}
