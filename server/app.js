const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const employeeRoutes = require("./routes/employee");

const isAdmin = require("./middlewares/admin");
const isEmployee = require("./middlewares/employee");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use("/public", express.static("public"));

mongoose.connect(
  `mongodb+srv://giakinh:giakinh@project2023.ehqvjgq.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);
mongoose.set("useCreateIndex", true);
app.use("/api/auth", authRoutes);
app.use("/api/admin", isAdmin, adminRoutes);
app.use("/api/employee", isEmployee, employeeRoutes);

app.use((req, res, next) => {
  var error = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  console.log(error);
  res.json({
    error: error.message,
  });
});

app.listen(port);
