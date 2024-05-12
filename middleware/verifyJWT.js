const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    jwt.verify(
      req.headers.authorization,
      process.env.SECRET,
      function (err, decoded) {
        if (err) {
          req.user = undefined;
          req.message = "Header verification failed";
          res
            .status(401)
            .send("User is not Authenticated to perform the operation");
          next();
        } else {
          req["options"] = {
            email: decoded.email,
            role: decoded.role,
          };
          next();
        }
      }
    );
  } else {
    res.status(401).send("User is not Authenticated to perform the operation");
  }
};

module.exports = verifyToken;
