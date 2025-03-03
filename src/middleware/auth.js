function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // 다음 미들웨어로 이동
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
}; // ES모듈 사용 시에는 함수 앞에 export 키워드를 붙여줘야 함
