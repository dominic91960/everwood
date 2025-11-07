'use client'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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

  useEffect(() => {
    // Don't redirect if already on login page
    if (isLoginPage) {
      return
    }

    // Check authentication status
    const isAuthenticated = typeof window !== 'undefined' 
      ? localStorage.getItem('admin_authenticated') === 'true'
      : false

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/admin/login')
    }
  }, [pathname, router, isLoginPage])

  // Don't render sidebar/navbar on login page
  if (isLoginPage) {
    return <>{children}</>
  }

  // Check authentication before rendering admin layout
  if (typeof window !== 'undefined' && localStorage.getItem('admin_authenticated') !== 'true') {
    return null // Will redirect via useEffect
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