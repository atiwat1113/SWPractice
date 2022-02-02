const express = require("express");
const dotenv = require("dotenv");

const hospitals = require("./routes/hospitals");

// Load env nars
dotenv.config({
  path: "./config/config.env",
});

const app = express();

app.use("/api/v1/hospitals", hospitals);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: 1,
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);