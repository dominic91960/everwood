import { Request, Response, NextFunction } from "express";

const parseNumber = (field: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body[field] = Number(req.body[field]);
      next();
    } catch {
      return res.status(400).json({
        message: `Failed to parse ${field} to a number`,
      });
    }
  };
};

export { parseNumber };
