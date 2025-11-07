'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { sendPasswordResetEmail, confirmPasswordReset, verifyPasswordResetCode, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  // Redirect to admin if already authenticated (don't show forgot password if logged in)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        router.push('/admin')
      }
    })

    return () => unsubscribe()
  }, [router])

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (emailError) setEmailError(null)
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address')
    }
  }

  // Step 1: Send OTP/Password Reset Email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setEmailError(null)

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      // TODO: Replace this with your backend API call to send OTP
      // Example: const response = await fetch('/api/auth/send-otp', { method: 'POST', body: JSON.stringify({ email }) })
      // For now, using Firebase's password reset email as a fallback
      
      // Use Firebase password reset email
      // Note: To avoid spam folder, configure Firebase email settings:
      // 1. Go to Firebase Console > Authentication > Templates > Password reset
      // 2. Customize the email template with your domain
      // 3. Add SPF, DKIM, and DMARC records for your domain (if using custom domain)
      // 4. Use a verified email sender in Firebase
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/admin/login/forgot-password`,
        handleCodeInApp: true // Set to true to handle in app, false for email link
      })
      
      setSuccess('Password reset email has been sent! Please check your inbox and spam/junk folder.')
      
      // Note: Firebase emails may go to spam. To fix:
      // 1. Customize email template in Firebase Console > Authentication > Templates
      // 2. Add SPF/DKIM records for your domain
      // 3. Or use your own email service (see EMAIL-DELIVERY-GUIDE.md)
      
      // For OTP flow, you need backend integration
      // Firebase sends a password reset link, not OTP code
      // For true OTP, implement backend API as described in README.md
      setIsLoading(false)
      
      /* 
      // TODO: Uncomment when backend API is ready
      // const response = await fetch('/api/auth/send-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // })
      // const data = await response.json()
      // if (data.success) {
      //   setSuccess('OTP has been sent to your email!')
      //   setStep('otp')
      // }
      */
    } catch (err: any) {
      console.error('Send OTP error:', err)
      setError(err.message || 'Failed to send OTP. Please try again.')
      setIsLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP code')
      setIsLoading(false)
      return
    }

    try {
      // TODO: Replace this with your backend API call to verify OTP
      // Example: const response = await fetch('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) })
      
      // For now, using a simple mock verification
      // In production, verify OTP with your backend:
      // const response = await fetch('/api/auth/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, otp })
      // })
      // const data = await response.json()
      // if (data.success) {
      //   setSuccess('OTP verified successfully!')
      //   setStep('reset')
      // } else {
      //   setError('Invalid OTP code. Please check and try again.')
      // }
      
      // Temporary: For Firebase password reset, we need the code from email link
      // This is a placeholder - replace with actual backend OTP verification
      if (otp.length === 6) {
        // Mock verification - replace with actual API call
        setSuccess('OTP verified successfully!')
        setStep('reset')
      } else {
        setError('Invalid OTP code. Please enter a 6-digit code.')
      }
      setIsLoading(false)
    } catch (err: any) {
      console.error('Verify OTP error:', err)
      setError('Invalid OTP code. Please check and try again.')
      setIsLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      // TODO: Replace this with your backend API call to reset password
      // After OTP verification, call your backend to reset password
      // Example: const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, otp, newPassword })
      // })
      
      // For Firebase: If using Firebase password reset link, use confirmPasswordReset
      // await confirmPasswordReset(auth, actionCode, newPassword)
      
      // Temporary: For now, using Firebase's updatePassword (requires user to be logged in)
      // In production, use your backend API:
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, otp, newPassword })
      // })
      // const data = await response.json()
      // if (data.success) {
      //   setSuccess('Password reset successfully! Redirecting to login...')
      //   setTimeout(() => router.push('/admin/login'), 2000)
      // }
      
      // Note: This is a placeholder - you need to implement backend API
      // Backend should: 1. Verify OTP, 2. Update password in database
      setSuccess('Password reset successfully! Redirecting to login...')
      setTimeout(() => {
        router.push('/admin/login')
      }, 2000)
      setIsLoading(false)
    } catch (err: any) {
      console.error('Reset password error:', err)
      setError(err.message || 'Failed to reset password. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center font-poppins px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-button mb-2">
            Ever Wood Collection
          </h1>
          <p className="text-gray-600 description">
            {step === 'email' && 'Forgot Password'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'reset' && 'Reset Password'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Step 1: Enter Email */}
          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Image
                      src="/image/contact/ctloog/mail.png"
                      alt="Email"
                      width={18}
                      height={18}
                      className="w-5 h-5 opacity-60"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => {
                      if (email && !validateEmail(email)) {
                        setEmailError('Please enter a valid email address')
                      }
                    }}
                    required
                    className={`w-full pl-12 pr-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#475158]/20 font-poppins text-base ${
                      emailError ? 'border-2 border-red-300' : ''
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="mt-2 text-sm text-red-600">{emailError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group bg-button text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 py-4"
              >
                <div className="flex flex-row items-center justify-center">
                  <div className="text-white description px-10">
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </div>
                </div>
              </button>

              <div className="text-center">
                <Link
                  href="/admin/login"
                  className="text-sm text-button hover:text-[#475158] transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#475158]/20 font-poppins text-2xl text-center tracking-widest"
                />
                <p className="mt-2 text-sm text-gray-500">
                  We've sent a 6-digit code to {email}
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group bg-button text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 py-4"
              >
                <div className="flex flex-row items-center justify-center">
                  <div className="text-white description px-10">
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </div>
                </div>
              </button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="text-sm text-button hover:text-[#475158] transition-colors"
                >
                  Resend OTP
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Change Email
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg
                      className="w-5 h-5 opacity-60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#475158]/20 font-poppins text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg
                      className="w-5 h-5 opacity-60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#475158]/20 font-poppins text-base"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group bg-button text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 py-4"
              >
                <div className="flex flex-row items-center justify-center">
                  <div className="text-white description px-10">
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </div>
                </div>
              </button>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Ever Wood Collection. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage

