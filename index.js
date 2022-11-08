const express = require("express");
const cors = require("cors");
require("colors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello im from backend");
});
app.listen(port, () => {
  console.log(`Doctor portal server running ong ${port}`.bgGreen);
});
