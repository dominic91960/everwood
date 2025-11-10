import { Router } from 'express';
import { submitNotification } from './controller';
import { notifyValidation } from './validation';

const router = Router();

router.post('/subscribe', notifyValidation, submitNotification);

export default router;

