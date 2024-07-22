import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
};

const loadingSlice = createSlice({
  //são como states
  name: "loading",
  initialState,
  reducers: {
    //são como funções

    //auth
    loadingTrue: (state) => {
      state.loading = true;
    },
    loadingFalse: (state, action) => {
      state.loading = false;
    },
  },
});

export const { loadingTrue, loadingFalse } = loadingSlice.actions;

export default loadingSlice.reducer;
