import { Request, Response, NextFunction } from "express";

import User from "../models/user";
import UserRole from "../models/user-role";
import Statistics from "../models/statistics";

import { admin } from "../utils/firebase-admin";
import { changeProfileImage, deleteProfileImage } from "../utils/s3";
import { sendPasswordResetMail } from "../utils/brevo";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      avatar,
      firstName,
      lastName,
      username,
      email,
      phoneNo,
      password,
      role,
    } = req.body;

    const existingUser = await User.findOne({
      email,
    });
    if (existingUser)
      return res.status(400).json({
        message: "User already exists with entered email",
      });

    const existingRole = await UserRole.findById(role);
    if (!existingRole)
      return res.status(400).json({
        message: "Provided role is invalid",
      });

    const { uid } = await admin.auth().createUser({
      email,
      password,
    });

    const user = new User({
      avatar,
      uid,
      firstName,
      lastName,
      username,
      email,
      phoneNo,
      role,
    });

    await user.save();
    if (existingRole.name === "CUSTOMER")
      await Statistics.findOneAndUpdate(
        {},
        { $inc: { totalCustomers: 1 } },
        { new: true, runValidators: true }
      );

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const createGoogleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      providerId,
      avatar,
      uid,
      firstName,
      lastName,
      username,
      email,
      phoneNo,
      role,
    } = req.body;
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser && existingUser.providerId !== "email/password")
      return res.status(201).json(existingUser);
    if (existingUser && existingUser.providerId === "email/password") {
      await admin.auth().deleteUser(uid);
      return res.status(400).json({
        message: "User already exists with given email",
      });
    }

    const existingRole = await UserRole.findById(role);
    if (!existingRole) {
      await admin.auth().deleteUser(uid);
      return res.status(400).json({
        message: "Provided role is invalid",
      });
    }

    const user = new User({
      providerId,
      avatar,
      uid,
      firstName,
      lastName,
      username,
      email,
      phoneNo,
      role,
    });

    await user.save();
    if (existingRole.name === "CUSTOMER")
      await Statistics.findOneAndUpdate(
        {},
        { $inc: { totalCustomers: 1 } },
        { new: true, runValidators: true }
      );

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query: { role?: string } = {};
    const { role } = req.query;
    if (role) query.role = role as string;

    const users = await User.find(query).populate("role", "name");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).populate("role", "name");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const getUserByUid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.params.uid;
    const user = await User.findOne({ uid }).populate("role", "name");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { field } = req.query;

    switch (field) {
      case "avatar": {
        const file = req.file as Express.Multer.File;

        user.avatar = await changeProfileImage(user.avatar, file);
        break;
      }

      case "profile": {
        const { firstName, lastName, role } = req.body;

        const roleExists = await UserRole.findById(role);
        if (!roleExists)
          return res.status(400).json({
            message: "Provided role is invalid",
          });

        user.firstName = firstName;
        user.lastName = lastName;
        user.role = role;
        break;
      }

      case "username": {
        const { username } = req.body;

        const existingUser = await User.findOne({
          username,
          _id: { $ne: req.params.id },
        });
        if (existingUser)
          return res.status(400).json({
            message: "User already exists with entered username",
          });

        user.username = username;
        break;
      }

      case "email": {
        const { email } = req.body;

        const existingUser = await User.findOne({
          email,
          _id: { $ne: req.params.id },
        });
        if (existingUser)
          return res.status(400).json({
            message: "User already exists with entered email",
          });

        user.email = email;
        await admin.auth().updateUser(user.uid, {
          email,
        });
        break;
      }

      case "password": {
        const { newPassword } = req.body;

        await admin.auth().updateUser(user.uid, {
          password: newPassword,
        });
        break;
      }

      case "phoneNo": {
        const { phoneNo } = req.body;

        const existingUser = await User.findOne({
          phoneNo,
          _id: { $ne: req.params.id },
        });
        if (existingUser)
          return res.status(400).json({
            message: "User already exists with entered phone number",
          });

        user.phoneNo = phoneNo;
        break;
      }

      case "addressInfo": {
        const { shippingInfo, billingInfo } = req.body;

        user.shippingInfo = shippingInfo;
        user.billingInfo = billingInfo;
        break;
      }

      case "shippingInfo": {
        const { shippingInfo } = req.body;

        user.shippingInfo = shippingInfo;
        break;
      }

      case "billingInfo": {
        const { billingInfo } = req.body;

        user.billingInfo = billingInfo;
        break;
      }
    }

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const sendPasswordResetEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: process.env.FIREBASE_PASSWORD_RESET_URL!,
    });
    const data = { firstName: user.firstName, email, resetLink };

    sendPasswordResetMail(data);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { newPassword } = req.body;
    await admin.auth().updateUser(user.uid, {
      password: newPassword,
    });

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await deleteProfileImage(user.avatar);
    await admin.auth().deleteUser(user.uid);

    const existingRole = await UserRole.findById(user.role);
    if (existingRole && existingRole.name === "CUSTOMER")
      await Statistics.findOneAndUpdate(
        {},
        { $inc: { totalCustomers: -1 } },
        { new: true, runValidators: true }
      );

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export {
  createUser,
  createGoogleUser,
  getUsers,
  getUserById,
  getUserByUid,
  updateUser,
  sendPasswordResetEmail,
  resetUserPassword,
  deleteUser,
};
