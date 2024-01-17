import jwt from "jsonwebtoken";
import { throwError } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(throwError(401, "Session End. Login Again! "));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(throwError(403, "Forbidden"));
    req.user = user;
    next();
  });
};
