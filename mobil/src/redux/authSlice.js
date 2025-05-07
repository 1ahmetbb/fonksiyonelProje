import { createSlice } from "@reduxjs/toolkit";
import { saveAuthData, clearAuthData } from "../util/authHelpers";

const initialState = {
  user: null,
  token: null,
  userId: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  lastUpdate: null,
  sessionId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const timestamp = new Date().toISOString();

      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
      state.userId = action.payload.userId || null;
      state.role = action.payload.role || null;
      state.isAuthenticated = !!action.payload.token;
      state.loading = false;
      state.lastUpdate = timestamp;
      state.sessionId = action.payload.sessionId || null;

      // Token'ları AsyncStorage'a kaydet
      if (action.payload.token) {
        saveAuthData(
          action.payload.token,
          action.payload.userId,
          action.payload.role,
          action.payload.user,
          action.payload.sessionId
        ).catch((error) => {
          console.error("Token kaydetme hatası:", error);
        });
      }
    },

    logout: (state) => {
      const timestamp = new Date().toISOString();
      // Redux state'ini tamamen temizle
      Object.assign(state, {
        ...initialState,
        lastUpdate: timestamp,
      });

      clearAuthData().catch((error) => {
        console.error("Storage temizleme hatası:", error);
      });
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Login işlemi başarılı olduğunda
    builder.addMatcher(
      (action) =>
        action.type === "apiSlice/executeMutation/fulfilled" &&
        action.meta?.arg?.endpointName === "login",
      (state, action) => {
        const timestamp = new Date().toISOString();
        console.log(`⚡ Login Response (${timestamp}):`, {
          userId: action.payload.userId,
          role: action.payload.role,
        });

        const user = action.payload.user || {
          name: action.payload.name,
          email: action.payload.email,
          title: action.payload.title,
          role: action.payload.role,
        };

        state.user = user;
        state.token = action.payload.token || null;
        state.userId = action.payload.userId || null;
        state.role = action.payload.role || null;
        state.isAuthenticated = !!action.payload.token;
        state.loading = false;
        state.lastUpdate = timestamp;

        if (action.payload.token) {
          saveAuthData(
            action.payload.token,
            action.payload.userId,
            action.payload.role,
            user,
            action.payload.sessionId
          ).catch((error) => {
            console.error("Token kaydetme hatası:", error);
          });
        }
      }
    );

    builder.addMatcher(
      (action) =>
        action.type === "apiSlice/executeMutation/fulfilled" &&
        action.meta?.arg?.endpointName === "logout",
      (state) => {
        const timestamp = new Date().toISOString();

        // Redux state'ini tamamen temizle
        Object.assign(state, {
          ...initialState,
          lastUpdate: timestamp,
        });
        clearAuthData().catch((error) => {
          console.error("Storage temizleme hatası:", error);
        });
      }
    );
  },
});

export const { loginSuccess, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
