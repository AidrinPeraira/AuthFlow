import { refreshAccessTokenAction } from "@/actions/LoginActions";
import { SessionData, sessionOptions } from "@/lib/sessions";
import axios from "axios";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers.js";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions,
    );

    if (session.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
  } catch (error) {
    console.error("Axios interceptor session error:", error);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessTokenAction();

      if (newAccessToken) {
        // Update the header for the retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // Execute the original request again
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);
