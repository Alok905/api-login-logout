const {
  signUser,
  loginUser,
  logoutOne,
  logoutAll,
} = require("../controllers/userController");
const protect = require("../middlewares/protect");

const userRouter = require("express").Router();

userRouter.route("/signup").post(signUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").get(protect, logoutOne);
userRouter.route("/logoutall").get(protect, logoutAll);
userRouter.route("/secure").get(protect, (req, res) => {
  res.status(201).json("Secure page");
});

module.exports = userRouter;
