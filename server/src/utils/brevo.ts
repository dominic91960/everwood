import * as brevo from '@getbrevo/brevo';
import ejs from 'ejs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Brevo API client
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export const sendContactMail = async (formData: ContactFormData): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, message } = formData;

    // Render user email template
    const userEmailHtml = await ejs.renderFile(
      path.join(__dirname, '../emails/contact/user.ejs'),
      {
        firstName,
        lastName,
        email,
        phone,
        message,
      }
    );

    // Render admin email template
    const adminEmailHtml = await ejs.renderFile(
      path.join(__dirname, '../emails/contact/admin.ejs'),
      {
        firstName,
        lastName,
        email,
        phone,
        message,
      }
    );

    // Send email to user (confirmation)
    const userEmail = new brevo.SendSmtpEmail();
    userEmail.sender = {
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@yourdomain.com',
      name: process.env.BREVO_SENDER_NAME || 'Everwood Collection',
    };
    userEmail.to = [{ email: email, name: `${firstName} ${lastName}` }];
    userEmail.subject = 'Thank You for Contacting Everwood Collection';
    userEmail.htmlContent = userEmailHtml;

    // Send email to admin (notification)
    const adminEmail = new brevo.SendSmtpEmail();
    adminEmail.sender = {
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@yourdomain.com',
      name: process.env.BREVO_SENDER_NAME || 'Everwood Collection',
    };
    adminEmail.to = [
      {
        email: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
        name: 'Admin',
      },
    ];
    adminEmail.subject = `New Contact Form Submission from ${firstName} ${lastName}`;
    adminEmail.htmlContent = adminEmailHtml;
    adminEmail.replyTo = { email: email, name: `${firstName} ${lastName}` };

    // Send both emails simultaneously
    await Promise.all([
      apiInstance.sendTransacEmail(userEmail),
      apiInstance.sendTransacEmail(adminEmail),
    ]);

    console.log('Contact emails sent successfully');
  } catch (error) {
    console.error('Error sending contact emails:', error);
    throw new Error('Failed to send contact emails');
  }
};


