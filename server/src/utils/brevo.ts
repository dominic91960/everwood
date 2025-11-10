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

interface NotifyMeData {
  email: string;
}

export const sendNotifyMeEmail = async (data: NotifyMeData): Promise<void> => {
  try {
    const { email } = data;

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
    adminEmail.subject = `🔔 New "Notify Me" Subscription from Coming Soon Page`;
    adminEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #475158;
            color: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 30px;
            text-align: center;
          }
          .email-box {
            background-color: #f9f9f9;
            border-left: 4px solid #475158;
            padding: 20px;
            margin: 20px 0;
            font-size: 18px;
            font-weight: bold;
          }
          .info {
            background-color: #e8f4f8;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New "Notify" Subscription</h1>
          </div>
          
          <p><strong>Someone is interested in your new collection!</strong></p>
          
          <p>A visitor has subscribed to be notified when you launch your new collection from the "Coming Soon" page.</p>
          
          <div class="email-box">
            📧 Email: <a href="mailto:${email}">${email}</a>
          </div>
          
          <div class="info">
            <strong>💡 What to do:</strong><br>
            • Add this email to your mailing list<br>
            • When your collection launches, send them a notification<br>
          
          </div>
          
          <div class="footer">
            <p>This is an automated notification from Everwood Collection Coming Soon Page</p>
            <p>Received on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
    adminEmail.replyTo = { email: email };

    await apiInstance.sendTransacEmail(adminEmail);

    console.log('Notify me email sent successfully to admin');
  } catch (error) {
    console.error('Error sending notify me email:', error);
    throw new Error('Failed to send notify me email');
  }
};
