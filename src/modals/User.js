const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "ALOK";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ id: this._id, email: this.email }, SECRET_KEY);
  this.tokens.push({ token });
  await this.save();
  return token;
};
userSchema.methods.filterToken = async function (cookieToken) {
  console.log(this.tokens);
  this.tokens = this.tokens.filter((token) => token.token != cookieToken);
  await this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
