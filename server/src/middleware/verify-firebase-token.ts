import { Request, Response, NextFunction } from "express";

import { admin } from "../utils/firebase-admin";
import User from "../models/user";

async function verifyUser(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res
        .status(401)
        .json({ message: "Missing or invalid authorization header" });

    const idToken = authHeader.split("Bearer ")[1];
    await admin.auth().verifyIdToken(idToken);

    next();
  } catch {
    return res.status(403).json({ message: "The user is unauthorized" });
  }
}

async function verifyUserAndAuthTime(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res
        .status(401)
        .json({ message: "Missing or invalid authorization header" });

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const authTime = decodedToken.auth_time * 1000;
    const isRecent = Date.now() - authTime < 5 * 60 * 1000;

    if (!isRecent)
      return res.status(401).json({ error: "Reauthentication required" });

    next();
  } catch {
    return res.status(403).json({ message: "The user is unauthorized" });
  }
}

async function verifyAdminUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const customerRoleId = process.env.CUSTOMER_ROLE_ID;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res
        .status(401)
        .json({ message: "Missing or invalid authorization header" });

    const idToken = authHeader.split("Bearer ")[1];
    const { uid } = await admin.auth().verifyIdToken(idToken);

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role.toString() === customerRoleId)
      return res.status(403).json({ message: "The user is unauthorized" });

    next();
  } catch {
    return res.status(403).json({ message: "The user is unauthorized" });
  }
}

async function verifyAdminUserAndAuthTime(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const customerRoleId = process.env.CUSTOMER_ROLE_ID;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res
        .status(401)
        .json({ message: "Missing or invalid authorization header" });

    const idToken = authHeader.split("Bearer ")[1];
    const { uid, auth_time } = await admin.auth().verifyIdToken(idToken);
    const isRecent = Date.now() - auth_time * 1000 < 5 * 60 * 1000;

    if (!isRecent)
      return res.status(401).json({ error: "Reauthentication required" });

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role.toString() === customerRoleId)
      return res.status(403).json({ message: "The user is unauthorized" });

    next();
  } catch {
    return res.status(403).json({ message: "The user is unauthorized" });
  }
}

async function verifyOwnerOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const customerRoleId = process.env.CUSTOMER_ROLE_ID;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res
        .status(401)
        .json({ message: "Missing or invalid authorization header" });

    const idToken = authHeader.split("Bearer ")[1];
    const { uid } = await admin.auth().verifyIdToken(idToken);

    const resourceOwner = await User.findById(req.params.id);
    const currentUser = await User.findOne({ uid });

    if (!resourceOwner || !currentUser)
      return res.status(404).json({ message: "User not found" });

    if (
      !resourceOwner._id.equals(currentUser._id) &&
      currentUser.role.toString() === customerRoleId
    )
      return res.status(403).json({ message: "The user is unauthorized" });

    next();
  } catch {
    return res.status(403).json({ message: "The user is unauthorized" });
  }
}

export {
  verifyUser,
  verifyUserAndAuthTime,
  verifyAdminUser,
  verifyAdminUserAndAuthTime,
  verifyOwnerOrAdmin,
};
