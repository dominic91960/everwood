# Email Delivery Guide - Avoiding Spam Folder

## Why Emails Go to Spam Folder

Emails from Firebase Authentication can end up in spam folders due to:
1. **Email Authentication Issues**: Missing SPF, DKIM, or DMARC records
2. **Sender Reputation**: Firebase's default sender may have lower reputation
3. **Email Content**: Generic templates trigger spam filters
4. **Domain Verification**: Unverified sending domain

## Solutions

### Option 1: Configure Firebase Email Templates (Recommended)

1. **Go to Firebase Console**
   - Navigate to: Authentication > Templates > Password reset
   - Click "Edit template"

2. **Customize Email Content**
   - Add your company/brand name
   - Personalize the subject line
   - Add your logo/branding
   - Use professional, non-spammy language

3. **Configure Action URL**
   - Set to: `https://yourdomain.com/admin/login/forgot-password`
   - This helps with email authentication

### Option 2: Use Custom Domain (Best for Deliverability)

1. **Set Up Custom SMTP in Firebase**
   - Go to: Firebase Console > Project Settings > Custom domain
   - Add your verified domain

2. **Add Email Authentication Records**
   
   **SPF Record** (TXT record in DNS):
   ```
   v=spf1 include:_spf.google.com ~all
   ```
   
   **DKIM Record**:
   - Firebase will provide DKIM keys in console
   - Add them to your DNS as TXT records
   
   **DMARC Record** (TXT record):
   ```
   v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
   ```

### Option 3: Use Your Own Email Service (Most Control)

Instead of Firebase's email service, use your backend to send emails:

1. **Set Up Email Service** (Nodemailer, SendGrid, AWS SES, etc.)
2. **Implement Backend API** for sending OTP
3. **Configure Proper Email Authentication**
4. **Use Verified Sender Domain**

Example with Nodemailer:
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.yourdomain.com',
  port: 587,
  secure: false,
  auth: {
    user: 'noreply@yourdomain.com',
    pass: 'your-email-password'
  },
  // Important for deliverability
  dkim: {
    domainName: 'yourdomain.com',
    keySelector: 'default',
    privateKey: 'your-private-key'
  }
});

async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: '"Ever Wood Collection" <noreply@yourdomain.com>',
    to: email,
    subject: 'Password Reset OTP - Ever Wood Collection',
    html: `
      <h2>Password Reset Request</h2>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  });
}
```

### Option 4: Quick Fixes (Immediate)

1. **Tell Users to Check Spam Folder**
   - Add message: "Please check your spam/junk folder if email not received"

2. **Add Email to Contacts**
   - Ask users to add `noreply@yourproject.firebaseapp.com` to contacts

3. **Whitelist Sender**
   - Add Firebase sender email to email client's whitelist

## Firebase Console Settings Checklist

- [ ] Customize email templates with your branding
- [ ] Set up custom domain for email sending
- [ ] Configure action URL (password reset link)
- [ ] Enable email link handling in app
- [ ] Verify sender email address

## Best Practices

1. **Always Customize Email Templates**
   - Use your brand name and logo
   - Professional subject lines
   - Clear, concise content

2. **Use Verified Domains**
   - Send from your own domain
   - Not from firebaseapp.com

3. **Implement Email Authentication**
   - SPF records
   - DKIM signing
   - DMARC policy

4. **Monitor Email Delivery**
   - Check bounce rates
   - Monitor spam complaints
   - Track open rates

5. **Gradual Rollout**
   - Start with small volume
   - Build sender reputation
   - Gradually increase sending

## Testing Email Delivery

1. **Send Test Emails** to different providers:
   - Gmail
   - Outlook
   - Yahoo
   - Corporate emails

2. **Check Spam Scores**:
   - Use tools like Mail-Tester.com
   - Check spam score before sending

3. **Monitor Deliverability**:
   - Track delivery rates
   - Check spam folder placement
   - Monitor bounce rates

## Current Implementation

The current code uses Firebase's `sendPasswordResetEmail`. To improve deliverability:

1. **Short Term**: Customize Firebase email templates
2. **Medium Term**: Set up custom domain with Firebase
3. **Long Term**: Implement custom email service with proper authentication

## Additional Resources

- [Firebase Email Templates Documentation](https://firebase.google.com/docs/auth/custom-email-handler)
- [SPF Record Setup](https://www.cloudflare.com/learning/dns/dns-records/dns-spf-record/)
- [DKIM Setup Guide](https://support.google.com/a/answer/174124)
- [DMARC Policy Guide](https://dmarc.org/wiki/FAQ)

