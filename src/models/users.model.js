const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

const saltRounds = 10;
userSchema.pre("save", function (next) {
  let user = this;
  // 비밀번호 변경
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next(); // 미들웨어 끝나면 다음으로 넘어가기
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
