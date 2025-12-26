import { Request, Response, NextFunction } from "express";
import UserRole from "../models/user-role";

const createUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const role = new UserRole({ name });
    await role.save();

    res.status(201).json(role);
  } catch (err) {
    next(err);
  }
};

const getUserRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await UserRole.find().sort({ createdAt: -1 });
    res.status(200).json(roles);
  } catch (err) {
    next(err);
  }
};

const getUserRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const role = await UserRole.findById(id);

    if (!role) return res.status(404).json({ message: "Role not found" });

    res.status(200).json(role);
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const role = await UserRole.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!role) return res.status(404).json({ message: "Role not found" });

    res.status(200).json(role);
  } catch (err) {
    next(err);
  }
};

const deleteUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const role = await UserRole.findByIdAndDelete(id);

    if (!role) return res.status(404).json({ message: "Role not found" });

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export {
  createUserRole,
  getUserRoles,
  getUserRoleById,
  updateUserRole,
  deleteUserRole,
};
