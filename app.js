const express = require("express");
const morgan = require("morgan");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const customerRouter = require("./routes/customerRoutes");
const partnerRouter = require("./routes/partnerRoutes");
const productRouter = require("./routes/productRoutes");

const kolyeRouter = require("./routes/kolyeRoutes");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("BRUUUHHH");
});
// 2) ROUTES

app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/partner", partnerRouter);

app.use("/api/v1/kolye", kolyeRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
