const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please log in first." });
  }

  let decoded;
  try {
    decoded = jwt.verify(header.slice("Bearer ".length), process.env.JWT_SECRET);
  } catch {
    return res
      .status(401)
      .json({ message: "Invalid or expired token. Please log in again." });
  }

  try {
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Account not found." });
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access only." });
  }

  next();
}

module.exports = { protect, adminOnly };