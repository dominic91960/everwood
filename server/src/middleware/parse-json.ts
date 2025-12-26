import { Request, Response, NextFunction } from "express";

const parseJson = (field: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body[field] = JSON.parse(req.body[field]);
      next();
    } catch {
      next(new Error(`Failed to parse ${field} to JSON`));
    }
  };
};

export { parseJson };
