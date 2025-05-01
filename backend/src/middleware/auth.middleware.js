import jwt from "jsonwebtoken";
import config from "../config.js";
import {db} from "../libs/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized access"));
  }

  try {
    const decoded = jwt.verify(token, config.jwt_secret);
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
      },
    });
    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Unauthorized access"));
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized access"));
  }
};

export default authMiddleware;