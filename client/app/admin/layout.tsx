import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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