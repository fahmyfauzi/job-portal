//api documentation
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

//imports package
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";

//security packages
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

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

//config api documentation with swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node Expressjs Job Portal Application",
    },
    servers: [
      {
        // url: "http://localhost:3000",
        url: "https://difficult-sarong-seal.cyclic.app",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerJSDoc(options);

//rest object
const app = express();

//security middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/jobs", jobRoute);

//home route
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

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
