import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

import AdminRouteGuard from "@/components/AdminRouteGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminRouteGuard>
      <div className="admin-light font-Tomorrow relative flex min-h-screen w-full overflow-hidden bg-white">
        <Sidebar />
        {/* Main content */}
        <div className="relative z-10 container mx-auto flex flex-1 flex-col px-6 py-6 sm:px-16 sm:py-6 text-black">
          <Navbar />
          {children}
        </div>
      </div>
    </AdminRouteGuard>
  );
}
