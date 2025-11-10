import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { sendNotifyMeEmail } from '../utils/brevo';

export const submitNotification = async (req: Request, res: Response) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email } = req.body;

    // Send notification email to admin
    await sendNotifyMeEmail({ email });

    return res.status(200).json({
      success: true,
      message: 'Thank you! We will notify you when we launch.',
    });
  } catch (error) {
    console.error('Notify me submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to subscribe. Please try again later.',
    });
  }
};

