import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    console.error("Token not found in cookies:", req.cookies);
    return res.status(401).json({ error: "Session End. Login Again!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      console.error("User not found in the database");
      return res.status(401).json({ error: "Session End. Login Again!" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).json({ error: "Forbidden" });
  }
};
