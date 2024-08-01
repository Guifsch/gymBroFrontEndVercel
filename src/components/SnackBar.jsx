import React, { useEffect } from "react";
import { Snackbar } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { snackBarClose } from "../redux/snackbar/snackBarSlice";
import Alert from "@mui/material/Alert";

function SnackBar() {
  const dispatch = useDispatch();
  const { message, open, severity, vertical, horizontal } = useSelector(
    (state) => state.snackBar
  );

  useEffect(() => {
    if (open) {
      const timeoutId = setTimeout(() => {
        dispatch(snackBarClose());
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [open, dispatch]);

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(snackBarClose());
  };

  // Verifica se message é um objeto e extrai a mensagem
  const displayMessage =
    typeof message === "object"
      ? message.message || "Ocorreu um erro"
      : message;

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleCloseSnack}
      autoHideDuration={5000}
    >
      <Alert
        onClose={handleCloseSnack}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {displayMessage}
      </Alert>
    </Snackbar>
  );
}

export default SnackBar;
