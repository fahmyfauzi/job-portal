//imports package
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";

//imports file
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoute.js";
import authRoutes from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import jobRoute from "./routes/jobRoute.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

//dotenv config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/jobs", jobRoute);

//validation middleware error
app.use(errorMiddleware);

//listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Node server Running in ${process.env.DEV_MODE} on http://localhost:${PORT}`
      .bgCyan.white
  );
});
