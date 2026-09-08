import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { setAccessToken } from "../../api/axiosInstance.js";
import {
  getCurrentUserRequest,
  loginRequest,
  logoutRequest,
  refreshRequest,
  registerRequest,
  resendVerificationRequest,
} from "./api/authApi.js";

export const AUTH_STATUS = {
  IDLE: "idle",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
};

function errorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      const data = await refreshRequest();
      setAccessToken(data?.accessToken ?? null);
      const currentUser = await getCurrentUserRequest();
      return currentUser?.user ?? null;
    } catch {
      setAccessToken(null);
      return rejectWithValue(null);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginRequest(credentials);
      setAccessToken(data?.accessToken ?? null);
      return data;
    } catch (error) {
      return rejectWithValue(errorMessage(error, "Could not sign in."));
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (details, { rejectWithValue }) => {
    try {
      const data = await registerRequest(details);
      setAccessToken(null);
      return data;
    } catch (error) {
      return rejectWithValue(errorMessage(error, "Could not create account."));
    }
  }
);

export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async (email, { rejectWithValue }) => {
    try {
      return await resendVerificationRequest({ email });
    } catch (error) {
      return rejectWithValue(
        errorMessage(error, "Could not resend verification email.")
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await logoutRequest();
  } finally {
    setAccessToken(null);
  }
});

const initialState = {
  user: null,
  status: AUTH_STATUS.IDLE,
  authError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.authError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authError = null;
        state.status = AUTH_STATUS.AUTHENTICATED;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.authError = null;
        state.status = AUTH_STATUS.UNAUTHENTICATED;
      })
      .addCase(login.pending, (state) => {
        state.authError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload?.user ?? null;
        state.status = AUTH_STATUS.AUTHENTICATED;
      })
      .addCase(login.rejected, (state, action) => {
        state.authError = action.payload || "Could not sign in.";
      })
      .addCase(register.pending, (state) => {
        state.authError = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.user = null;
        state.status = AUTH_STATUS.UNAUTHENTICATED;
      })
      .addCase(register.rejected, (state, action) => {
        state.authError = action.payload || "Could not create account.";
      })
      .addCase(resendVerification.pending, (state) => {
        state.authError = null;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.authError = action.payload || "Could not resend verification email.";
      })
      .addCase(logout.pending, (state) => {
        state.authError = null;
      })
      .addCase(logout.fulfilled, resetAuthentication)
      .addCase(logout.rejected, resetAuthentication);
  },
});

function resetAuthentication(state) {
  state.user = null;
  state.authError = null;
  state.status = AUTH_STATUS.UNAUTHENTICATED;
}

export const { clearAuthError } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectAuthError = (state) => state.auth.authError;
export const selectIsAuthenticated = (state) =>
  state.auth.status === AUTH_STATUS.AUTHENTICATED;
export const selectIsAuthLoading = (state) => state.auth.status === AUTH_STATUS.IDLE;

export default authSlice.reducer;
