import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.sessionId !== decoded.sessionId) {
        return res.status(403).json({
          message: "Your session expired or logged in somewhere else",
        });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token" });
  }
};

// Admin only
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin only access" });
  }
};

export const requireApprovalPermission = (req, res, next) => {
  if (!req.user || !req.user.canApprove) {
    return res
      .status(403)
      .json({ message: "You do not have approval permission" });
  }
  next();
};
