const jwt = require("jsonwebtoken");
const User = require("../modals/User");
const SECRET_KEY = "ALOK";

const protect = async (req, res, next) => {
  try {
    const cookieToken = req.cookies.userpresent;
    //checking wheather the user is logged in or not
    if (cookieToken) {
      const decoded = await jwt.verify(cookieToken, SECRET_KEY);
      const user = await User.findOne({ email: decoded.email });

      //checking wheather the token is present in the user's tokens list, if not found then the user has logged out from all device
      let isTokenFound = user.tokens.find(
        (token) => token.token == cookieToken
      );
      if (isTokenFound) {
        req.user = user;
        req.token = cookieToken;
        next();
      } else {
        throw new Error("token not found");
      }
    } else {
      throw new Error("Not authorised");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = protect;
