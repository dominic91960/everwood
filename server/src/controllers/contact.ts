import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { sendContactMail } from "../utils/brevo";

const createContactMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, message, recaptchaToken } = req.body;

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY!,
          response: recaptchaToken,
        },
      }
    );
    const recaptchaResult = response.data;

    if (!recaptchaResult.success || recaptchaResult.score < 0.5)
      throw new Error("reCAPTCHA verification failed. Please try again.");

    const data = { name, email, message };
    sendContactMail(data);

    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export { createContactMessage };
