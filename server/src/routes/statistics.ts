import { Router } from "express";
import { getStatistics, resetStatistics } from "../controllers/statistics";

const router = Router();

router.get("/", getStatistics);
router.delete("/", resetStatistics);

export default router;
