import { Router } from "express";

import { createContactMessage } from "../controllers/contact";
import { validateContactMessage } from "../validators/contact-validator";
import { runValidation } from "../middleware/validate";

const router = Router();

router.post("/", validateContactMessage, runValidation, createContactMessage);

export default router;
