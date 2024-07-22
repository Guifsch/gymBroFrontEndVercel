import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: "",
  autoHideDuration: 5000,
  vertical: "top",
  horizontal: "center",
  severity: "success"
};

const snackBarSlice = createSlice({
  //são como states
  name: "snackBar",
  initialState,
  reducers: {
    //são como funções

    //auth
    snackBarMessageSuccess: (state, action) => {
      state.open = true;
      state.severity = "success";
      state.message = action.payload;
    },
    snackBarMessageError: (state, action) => {
      state.open = true;
      state.severity = "error";
      state.message = action.payload;
    },
    snackBarClose: (state) => {
      state.open = false;
    },
    snackBarCloseButton: (state) => {
      state.onClose = true;
    },
    snackBarDuration: (state, action) => {
      state.autoHideDuration = action.payload;
    },
    snackBarPositionHorizontal: (state, action) => {
      state.vertical = action.payload;
    },
    snackBarPositionVertical: (state, action) => {
      state.horizontal = action.payload;
    },
  },
});

export const { snackBarMessageSuccess, snackBarMessageError,  updateUserSuccess, snackBarClose } = snackBarSlice.actions;

export default snackBarSlice.reducer;
