require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const userRoutes = require("./routes/userRouter");
const save4laterRoute = require("./routes/save4laterRouter");
const getQuizRoute = require("./routes/quizeRouter");
const wrongAnswerRoute = require("./routes/wrongAnswerRoute");
const HttpError = require("./middleware/HttpError")




const url = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluster0.wdrbduw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

app.use(bodyParser.json());

app.use(
  cors({
    // origin: "http://localhost:3001", // Add both production and local URLs
    origin: true, // Add both production and local URLs
    credentials: true,
  })
);

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/api/user", userRoutes);
app.use("/api/save4later", save4laterRoute);
app.use("/api/quiz", getQuizRoute);
app.use("/api", wrongAnswerRoute);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({
    message: err.message || "Something went wrong, Please try again later.",
  });
});

// const PORT = 3000;
const PORT = process.env.PORT || 3000;

mongoose
  .connect(url)
  .then((req, res) => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
