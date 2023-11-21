//import express
const express = require("express");

//rest object
const app = express();

//routes
app.get("/", (req, res) => {
  res.send("<h1>Welcome To Job Portal</h1>");
});

//listen
const port = 3000;
app.listen(port, () => {
  console.log(`Node server Running on http://localhost:${port}`);
});
