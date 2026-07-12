const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token required" });
    }
    const token = authorization.split(" ")[1];
    const { _id } = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(_id).select("-password");
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};
