import { Request, Response, NextFunction } from "express";

const parseNumber = (field: string) => {
  return (req: Request, _: Response, next: NextFunction) => {
    if (req.body[field] === undefined)
      return next(new Error(`${field} is required`));

    try {
      req.body[field] = Number(req.body[field]);
      next();
    } catch {
      next(new Error(`Failed to parse ${field} to a number`));
    }
  };
};

export { parseNumber };
