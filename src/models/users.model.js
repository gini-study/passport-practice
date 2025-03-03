const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minLenght: 5,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // 일반 unique의 경우 null 값도 중복으로 처리, sparse는 null 값은 중복으로 처리하지 않음
  },
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plain password => client , this.password => db에 존재하는 password
  if (plainPassword === this.password) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
