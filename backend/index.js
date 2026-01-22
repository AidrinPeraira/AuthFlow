import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "good", "good.html"));
});

app.post("/login", (req, res) => {
  console.log("User logged in. Issuing tokens.");

  const accessToken = "this-good-access-token";
  const refreshToken = "this-good-refresh-token";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({
    message: "Login successful",
  });
});

app.get("/dashboard", (req, res) => {
  const { accessToken } = req.cookies;

  console.log("Cookies received:", req.cookies);

  if (!accessToken) {
    return res.status(401).json({ message: "No cookie found. Access denied." });
  }

  res.status(200).json({
    message: "Welcome to the protected dashboard!",
    user: "Authenticated User",
  });
});

app.listen(5000, () => {
  console.log("Server for good running at http://localhost:5000");
});
