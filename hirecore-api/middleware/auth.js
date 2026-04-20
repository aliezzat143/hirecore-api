const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
}

function authenticateAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Insufficient permissions" });
  }
  next();
}

module.exports = authenticateToken;
module.exports.authenticateAdmin = authenticateAdmin;