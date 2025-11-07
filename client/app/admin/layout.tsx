'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === '/admin/login'
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)

      // Don't redirect if already on login page
      if (isLoginPage) {
        return
      }

      // Redirect to login if not authenticated
      if (!currentUser) {
        router.push('/admin/login')
      }
    })

    return () => unsubscribe()
  }, [pathname, router, isLoginPage])

  // Don't render sidebar/navbar on login page
  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen w-full bg-[#F8F8F6] font-poppins items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-button"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated (will be handled by useEffect, but prevent rendering)
  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F8F8F6] font-poppins">
      <Sidebar />
      {/* Main content */}
      <div className="container mx-auto flex-1 px-6 py-6 sm:px-16 sm:py-6">
        <Navbar />
        {/* Main content area */}
        <div>{children}</div>
      </div>
    </div>
  );
}