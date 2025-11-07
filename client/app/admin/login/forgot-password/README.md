# Forgot Password with OTP Feature

## Overview
This is a forgot password flow with OTP (One-Time Password) verification. The frontend UI is complete, but you need to implement the backend API endpoints.

## Current Implementation
- ✅ Frontend UI for 3-step flow (Email → OTP → Reset Password)
- ✅ Email validation
- ✅ OTP input field (6-digit)
- ✅ Password reset form with confirmation
- ✅ Error handling and success messages
- ⚠️ Backend API integration needed

## Required Backend API Endpoints

### 1. Send OTP API
**Endpoint:** `POST /api/auth/send-otp`
**Request Body:**
```json
{
  "email": "user@example.com"
}
```
**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```
**Backend should:**
- Generate a 6-digit OTP
- Store OTP with expiration (e.g., 10 minutes) in database/cache
- Send OTP via email (using nodemailer, SendGrid, etc.)

### 2. Verify OTP API
**Endpoint:** `POST /api/auth/verify-otp`
**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```
**Response:**
```json
{
  "success": true,
  "message": "OTP verified",
  "token": "verification_token_for_password_reset"
}
```
**Backend should:**
- Verify OTP matches stored OTP for the email
- Check if OTP is not expired
- Return a temporary token for password reset (JWT with short expiry)

### 3. Reset Password API
**Endpoint:** `POST /api/auth/reset-password`
**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```
**Backend should:**
- Verify OTP again (or use the token from step 2)
- Hash the new password
- Update password in database (Firebase/your auth system)
- Invalidate the OTP

## Integration Steps

1. **Update `handleSendOTP` function** in `page.tsx`:
   - Replace Firebase `sendPasswordResetEmail` with your API call
   - Uncomment the TODO section

2. **Update `handleVerifyOTP` function**:
   - Replace mock verification with API call
   - Store the verification token

3. **Update `handleResetPassword` function**:
   - Replace placeholder with API call
   - Include the verification token from step 2

## Example Backend Implementation (Node.js/Express)

```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Store OTPs in memory (use Redis in production)
const otpStore = new Map();

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  
  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  
  // Store OTP with 10-minute expiration
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });
  
  // Send email
  await sendOTPEmail(email, otp);
  
  res.json({ success: true, message: 'OTP sent successfully' });
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore.get(email);
  
  if (!stored || stored.expiresAt < Date.now()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }
  
  if (stored.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
  
  // Generate verification token
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
  
  res.json({ success: true, token });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  // Verify OTP again
  const stored = otpStore.get(email);
  if (!stored || stored.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
  
  // Update password in Firebase or your auth system
  // await admin.auth().updateUser(userId, { password: hashedPassword });
  
  // Remove OTP
  otpStore.delete(email);
  
  res.json({ success: true, message: 'Password reset successfully' });
});
```

## Notes
- The current implementation uses Firebase's password reset email as a fallback
- For production, implement the backend API endpoints above
- Use Redis or database to store OTPs instead of in-memory Map
- Implement rate limiting to prevent OTP spam
- Consider SMS OTP as an alternative to email

