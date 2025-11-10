import { Router } from 'express';
import { submitContactForm } from './controller';
import { contactValidation } from './validation';

const router = Router();

router.post('/submit', contactValidation, submitContactForm);

export default router;


