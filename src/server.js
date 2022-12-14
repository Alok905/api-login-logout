const { json, urlencoded } = require("body-parser");
const express = require("express");
const userRouter = require("./routes/userRouter");
const app = express();
require("./db/conn");
const path = require("path");
const cookieParser = require("cookie-parser");

const staticPath = path.join(__dirname, "..", "public");

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(staticPath));
app.use("/user/", userRouter);

app.get("/", (req, res) => {
  // req.cookies
  // res.coo
});

app.listen(8000, () => {
  console.log("Listening to port 8000");
});
