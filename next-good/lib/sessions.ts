import { SessionOptions } from "iron-session";

export interface SessionData {
  accessToken?: string;
}

export const sessionOptions: SessionOptions = {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "server_session",
  cookieOptions: {
    secure: false,
    httpOnly: true,
  },
};
