import express from "express";
const app = express();
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/routes.js";

dotenv.config();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: "https://vendorbay1.netlify.app",
    credentials: true,
  })
);

app.use(router)

app.get("/", (req, res) => {
  res.send("App is working...");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
