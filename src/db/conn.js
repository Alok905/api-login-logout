const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/logoutpractice")
  .then(() => console.log("connected"))
  .catch((err) => console.log("error = " + err.message));
