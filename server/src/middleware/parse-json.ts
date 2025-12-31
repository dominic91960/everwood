import { Request, Response, NextFunction } from "express";

const parseJson = (field: string) => {
  return (req: Request, _: Response, next: NextFunction) => {
    if (req.body[field] === undefined)
      return next(new Error(`${field} is required`));

    try {
      req.body[field] = JSON.parse(req.body[field]);
      next();
    } catch {
      next(new Error(`Failed to parse ${field} to JSON`));
    }
  };
};

export { parseJson };
