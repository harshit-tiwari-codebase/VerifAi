import axiosInstance from "../../../api/axiosInstance";

// Thin service layer — maps 1:1 to Section 7 of the project context
// (POST /api/auth/register|login|refresh|logout). Keeping this separate from
// the Redux auth slice means the request shape can change without touching any
// component that consumes auth state.

export async function registerRequest({ name, email, password }) {
  const { data } = await axiosInstance.post("/auth/register", {
    name,
    email,
    password,
  });
  return data;
}

export async function loginRequest({ email, password }) {
  const { data } = await axiosInstance.post("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function refreshRequest() {
  const { data } = await axiosInstance.post("/auth/refresh");
  return data;
}

export async function getCurrentUserRequest() {
  const { data } = await axiosInstance.get("/auth/me");
  return data;
}

export async function logoutRequest() {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
}

export async function resendVerificationRequest({ email }) {
  const { data } = await axiosInstance.post("/auth/resend-verification", {
    email,
  });
  return data;
}
