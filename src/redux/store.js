import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import snackBarReducer from "./snackbar/snackBarSlice";
import loadingReducer from "./loading/loadingSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({ user: userReducer, snackBar: snackBarReducer, loading: loadingReducer}); //junta reducers

const persistConfig = {
  //o que será salvo no storage
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

//configuração padrão do store
export const store = configureStore({
  reducer: persistedReducer, //utilização do reducer e persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store) //para usar no main