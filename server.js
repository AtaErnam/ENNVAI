/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  const fullMessage = err.message;
  const errmsgStart = fullMessage.indexOf("errmsg:") + 8; // Find errmsg inside message
  const errmsgStop = fullMessage.indexOf(",", errmsgStart); // Find first comma after that
  const errmsgLen = errmsgStop - errmsgStart;
  const errorText = fullMessage
  console.log(err.name);
  console.log(errorText);
  console.log("UNCAUGHT REJECTION!!!");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connected"));

const port = process.env.port || 3001;
const server = app.listen(port, () => {
  console.log("HELOO");
});

process.on("unhandledRejection", (err) => {
  const fullMessage = err.message;
  const errmsgStart = fullMessage.indexOf("errmsg:") + 8; // Find errmsg inside message
  const errmsgStop = fullMessage.indexOf(",", errmsgStart); // Find first comma after that
  const errmsgLen = errmsgStop - errmsgStart;
  //const errorText = fullMessage.substr(errmsgStart, errmsgLen);
  console.log(err.name);
  //console.log(errorText);
  console.log("UNHANDLED REJECTION!!!");
  server.close(() => {
    process.exit(1);
  });
});
