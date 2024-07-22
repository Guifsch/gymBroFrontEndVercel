import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  header: false,
  snackBarMessageLogout: false
};

const userSlice = createSlice({
  //são como states
  name: "user",
  initialState,
  reducers: {
    //são como funções

    //auth
  

    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.header = true;
      state.snackBarMessageLogout = false
    },
    //update usuário
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
    //delete usuário
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    signOut: (state) => {
      state.currentUser = null;
      state.snackBarMessageLogout = true
    },
  },
});

export const {
  signInSuccess,
  updateUserSuccess,
  deleteUserSuccess,
  signOut,
} = userSlice.actions;

export default userSlice.reducer;
