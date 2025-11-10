import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { sendContactMail } from '../utils/brevo';

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { firstName, lastName, email, phone, message } = req.body;

    // Send emails via Brevo
    await sendContactMail({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send your message. Please try again later.',
    });
  }
};


