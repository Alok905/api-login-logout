const User = require("../modals/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "ALOK";

const signUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    password = await bcrypt.hash(password, 10);

    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new Error("User already exist");
    }

    const newUser = new User({ name, email, password });

    //generating the token for the new signed up user
    const token = await newUser.generateToken();

    //storing the token inside the cookies
    res.cookie("userpresent", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      httpOnly: true,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email });

    if (!existUser) {
      throw new Error("User not found");
    }
    //checking wheather the password is correct or not
    const isMatchPassword = await bcrypt.compare(password, existUser.password);

    if (isMatchPassword) {
      let matchUser = false;

      //checking the current cookie of name "userpresent", if it's found, then an user is logged in.
      const cookieToken = req.cookies.userpresent;
      if (cookieToken) {
        //checking wheather the current signing user is same as the logged in user
        const decoded = jwt.verify(cookieToken, SECRET_KEY);
        if (existUser._id.toString() === decoded.id) {
          matchUser = true;
        }
      }
      //(if the logged in user is not same as the currently logging in user) or (if there is no token present)    => then we have to generate new token otherwise not
      const generateToken = !matchUser || !cookieToken;
      if (generateToken) {
        const token = await existUser.generateToken();
        res.cookie("userpresent", token, {
          expired: new Date(Date.now() + 1000 * 60 * 60 * 24),
          httpOnly: true,
        });
      }
      res.status(201).json(existUser);
    } else {
      throw new Error("Invalid details");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};
const logoutOne = async (req, res) => {
  try {
    //deleting the current token from the tokens list of user inside database
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token != req.token
    );
    await req.user.save();

    //clearing the cookie from browser
    res.clearCookie("userpresent");
    res.status(201).json("Logged out");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};
const logoutAll = async (req, res) => {
  try {
    res.clearCookie("userpresent");
    //cleared all the tokens
    req.user.tokens = [];
    req.user.save();
    res.status(201).json("Logged out from all device");
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = { signUser, loginUser, logoutOne, logoutAll };
