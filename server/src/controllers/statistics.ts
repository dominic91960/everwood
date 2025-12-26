import { Request, Response, NextFunction } from "express";
import Statistics from "../models/statistics";

const getStatistics = async (_: Request, res: Response, next: NextFunction) => {
  try {
    let statistics = await Statistics.findOne().populate("topProducts.product");
    if (!statistics) statistics = await Statistics.create({});

    statistics.topProducts.sort((a, b) => b.purchasedTimes - a.purchasedTimes);
    statistics.monthlyEarnings.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });

    res.status(200).json(statistics);
  } catch (err) {
    next(err);
  }
};

const resetStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Statistics.deleteOne();
    const statistics = await Statistics.create({});

    res.status(200).json(statistics);
  } catch (err) {
    next(err);
  }
};

export { getStatistics, resetStatistics };
