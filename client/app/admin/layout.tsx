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
      <div className="font-Tomorrow relative flex min-h-screen w-full overflow-hidden bg-[#0A0A1F]">
        {/* Top-left light accent */}
        <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/8 -translate-y-1/5 rounded-full bg-[#028EFC]/72 blur-[362px]"></div>

        {/* Bottom-right light accent */}
        <div className="absolute right-0 bottom-2.5 h-96 w-96 translate-x-1/3 translate-y-1/12 rounded-full bg-[#028EFC]/72 blur-[362px]"></div>

        <Sidebar />
        {/* Main content */}
        <div className="relative z-10 container mx-auto flex flex-1 flex-col px-6 py-6 sm:px-16 sm:py-6">
          <Navbar />
          {children}
        </div>
      </div>
    </AdminRouteGuard>
  );
}
