const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verify);
    if (verify.usertype == "admin") {
      next();
    } else {
      return res.status(401).json({
        msg: "not admin",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "invalid token",
    });
  }
};
