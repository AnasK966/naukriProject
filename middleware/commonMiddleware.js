const jwt = require("jsonwebtoken");

exports.requireSignin = (req, res, next) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, process.env.JWT_SECRET);  //_id that we sent with the payload
      req.user = user;  //attach user with the request,token expiry and token issue time
    } else {
      return res.status(400).json({ message: "Authorization required" });
    }
    next();
};

exports.empMiddleware = (req, res, next) => {
  if (req.user.role !== "emp") {
    return res.status(400).json({ message: "Employee access denied" });
  }
  next();
};

exports.cmpMiddleware = (req, res, next) => {
  if (req.user.role !== "cmp") {
    return res.status(400).json({ message: "Company access denied" });
  }
  next();
};