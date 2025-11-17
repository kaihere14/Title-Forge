import express from "express";
import "dotenv/config";
import youtubeRouter from "./routes/youtube.route.js";
import userRoute from "./routes/user.routes.js";
import payment from "./routes/paymentRoute.js";
import { connectDB } from "./db/database.js";
import cookieParser from "cookie-parser";
import nityashaRoute from "./routes/nityashaRoute.js";
import queueRouter from "./routes/queue.routes.js";

import cors from "cors";
const app = express();
const port = 3000;

app.set("trust proxy", 1);
app.use(
  cors({
    origin: [
      "https://title-forge.vercel.app",
      "http://localhost:5173",
      "https://titleforge.me",
      "https://www.titleforge.me",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/youtube", youtubeRouter);
app.use("/api/user", userRoute);
app.use("/api/payment", payment);
app.use("/api/nityasha", nityashaRoute);
app.use("/api/queue", queueRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectDB().then(async () => {
  app.listen(port, async () => {
    console.log(`🚀 Server listening on port ${port}`);
  });
});
