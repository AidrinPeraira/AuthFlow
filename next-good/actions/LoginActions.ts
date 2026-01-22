"use server";

import { apiClient } from "@/axios/AxiosApi";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/sessions";

export async function loginPostAction() {
  try {
    const response = await apiClient.post("/login");
    const { message, accessToken, refreshToken } = response.data;

    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );

    session.accessToken = accessToken;

    await session.save();

    const cookieStore = await cookies();

    cookieStore.set("refreshToken", refreshToken, {
      sameSite: "lax",
      secure: false,
      httpOnly: true,
    });

    return { message, success: true };
  } catch (error) {
    console.error("Error in login action:", error);
    return { message: "Login failed", success: false };
  }
}

export async function getProtectedDashboard() {
  try {
    const response = await apiClient.get("/dashboard");

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error(
      "Dashboard Fetch Error:",
      error.response?.data || error.message,
    );
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to fetch dashboard data",
    };
  }
}

export async function refreshAccessTokenAction() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) throw new Error("No refresh token available");

    const response = await apiClient.post("/refresh", { refreshToken });
    const { accessToken } = response.data;

    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions,
    );
    session.accessToken = accessToken;
    await session.save();

    return accessToken;
  } catch (error) {
    console.error("Refresh action failed:", error);
    return null;
  }
}
