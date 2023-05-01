const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

const errorMiddleware = require("./middleware/error");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route Imports
const product = require("./routes/productRoutes");
const vendor = require("./routes/vendorRoutes");
const user = require("./routes/userRoutes");
const order = require("./routes/orderRoutes");

//Routes
app.use("/api/v1", product);
app.use("/api/v1", vendor);
app.use("/api/v1", user);
app.use("/api/v1", order);

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
