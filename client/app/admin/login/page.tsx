'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Redirect to admin if already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        router.push('/admin')
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // User will be redirected by the onAuthStateChanged listener
      router.push('/admin')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to sign in. Please check your credentials.')
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
          <p className="text-gray-600 description">Admin Login</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
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
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#475158]/20 font-poppins text-base"
              />
            </div>

            {/* Password Field */}
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#475158]/20 font-poppins text-base"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-button bg-[#F5F5F5] border-gray-300 rounded focus:ring-2 focus:ring-[#475158]/20"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-button hover:text-[#475158] transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full group bg-button text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="flex flex-row items-center justify-center">
                <div className="text-white description px-4 sm:px-3 md:px-5 lg:px-2 xl:px-3 2xl:px-4 font-poppins">
                  {isLoading ? 'Logging in...' : 'Login'}
                </div>
                {!isLoading && (
                  <div className="text-white text-sm pr-1 py-1">
                    <img
                      src="/image/Icon/Buttonicon.png"
                      alt="arrow-right"
                      width={50}
                      height={50}
                      className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px] lg:w-[30px] lg:h-[30px] xl:w-[40px] xl:h-[40px] 2xl:w-[55px] 2xl:h-[55px]"
                    />
                  </div>
                )}
              </div>
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Secure admin access to manage your content
            </p>
          </div>
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

export default LoginPage

