import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import multer from "multer";

const isMulterError = (e: unknown): e is multer.MulterError =>
  e instanceof multer.MulterError;

const isDuplicateKeyError = (
  e: unknown
): e is { code?: number; keyValue?: Record<string, unknown> } => {
  return typeof e === "object" && e !== null && "code" in e && e.code === 11000;
};

const isCastError = (e: unknown): e is mongoose.Error.CastError =>
  e instanceof mongoose.Error.CastError;

const isValidationError = (e: unknown): e is mongoose.Error.ValidationError =>
  e instanceof mongoose.Error.ValidationError;

const isMongooseError = (e: unknown): e is mongoose.Error =>
  e instanceof mongoose.Error;

const isStandardError = (e: unknown): e is Error => e instanceof Error;

const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let status: number;
  let message: string;

  if (isMulterError(err)) {
    status = 400;
    message = err.message;
  } else if (isCastError(err)) {
    status = 400;
    message = `Invalid value for '${err.path}': '${err.value}'`;
  } else if (isValidationError(err)) {
    const error = Object.values(err.errors)[0]?.message;

    status = 400;
    message = error || "Validation failed";
  } else if (isDuplicateKeyError(err)) {
    const fields = Object.keys(err.keyValue ?? {});

    status = 409;
    message = `Duplicate value for field(s): ${fields.join(", ")}`;
  } else if (isMongooseError(err)) {
    status = 500;
    message = err.message || "Database error";
  } else if (isStandardError(err)) {
    status = 500;
    message = err.message;
  } else {
    status = 500;
    message = "An unknown error occurred";
  }

  // eslint-disable-next-line no-console
  console.log("ERROR: ", err);
  // eslint-disable-next-line no-console
  console.log("MESSAGE: ", message);
  res.status(status).json({ message });
};

export default errorHandler;
