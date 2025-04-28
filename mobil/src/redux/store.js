import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slice/api/apiSlice";
import authReducer from "./authSlice";

// Store yapılandırması
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: true,
    }).concat(apiSlice.middleware),
  devTools: true,
});

export default store;