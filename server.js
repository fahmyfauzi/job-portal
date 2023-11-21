//imports
import express from "express";
import dotenv from "dotenv";
import colors from "colors";

//dotenv config
dotenv.config();

//rest object
const app = express();

//routes
app.get("/", (req, res) => {
  res.send("<h1>Welcome To Job Portal</h1>");
});

//listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Node server Running in ${process.env.DEV_MODE} on http://localhost:${PORT}`
      .bgCyan.white
  );
});
