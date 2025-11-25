"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar2() {
  return (
    <>
      <Navbar />
      <div className="h-20"></div>
    </>
  );
}
// kffff
function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div
        className={cn("fixed top-2 lg:top-4 inset-x-0 max-w-5xl mx-auto z-50 px-4", className)}
      >
        {/* Desktop Navbar */}
        <div className="bg-white rounded-full hidden lg:flex items-center justify-center px-8 shadow-lg">
          {/* <Link href="/" className="shrink-0">
            <Image
              src="/image/Logo/Logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
          </Link> */}
          <Menu setActive={setActive} className="gap-x-4">
            <Link href="/" className={`cursor-pointer hover:text-black transition-colors ${pathname === '/' ? 'text-black font-bold' : 'text-gray-600'}`}>
              Home
            </Link>
            <Link href="/about" className={`cursor-pointer hover:text-black transition-colors ${pathname === '/about' ? 'text-black font-bold' : 'text-gray-600'}`}>
              About
            </Link>
            <MenuItem setActive={setActive} active={active} item="Catalog" isActive={pathname?.startsWith('/Catalog')} href="/Catalog">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/Catalog?category=Living">Living</HoveredLink>
                <HoveredLink href="/Catalog?category=Bedroom">Bedroom</HoveredLink>
                <HoveredLink href="/Catalog?category=Wardrobes">Wardrobes</HoveredLink>
                <HoveredLink href="/Catalog?category=Kitchen">Kitchen</HoveredLink>
              </div>
            </MenuItem>
            <Link href="/designyourown" className={`cursor-pointer hover:text-black transition-colors ${pathname === '/designyourown' ? 'text-black font-bold' : 'text-gray-600'}`}>
              Design Your Own
            </Link>
            <Link href="/contact" className={`cursor-pointer hover:text-black transition-colors ${pathname === '/contact' ? 'text-black font-bold' : 'text-gray-600'}`}>
              Contact
            </Link>
            <Link href="/Blog" className={`cursor-pointer hover:text-black transition-colors ${pathname === '/Blog' ? 'text-black font-bold' : 'text-gray-600'}`}>
              Blog
            </Link>
          </Menu>
        </div>

        {/* Mobile Navbar */}
        <div className="bg-white rounded-full lg:hidden flex items-center justify-between px-6 py-4 shadow-lg">
          <Link href="/" className="shrink-0">
            <Image
              src="/image/Logo/Logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-8 h-8"
            />
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setCatalogOpen(false);
            }}
            className="flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
          >
            <span className={`w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mounted && mobileMenuOpen && (
        <div className="fixed top-20 left-4 right-4 bottom-4 bg-white rounded-2xl shadow-xl z-40 lg:hidden overflow-hidden">
          <div className="flex flex-col p-6 gap-4 overflow-y-auto h-full">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`hover:text-black font-medium py-2 transition-colors ${pathname === '/' ? 'text-black font-bold' : 'text-gray-600'}`}>
              Home
            </Link>
            <div className="border-t"></div>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className={`hover:text-black font-medium py-2 transition-colors ${pathname === '/about' ? 'text-black font-bold' : 'text-gray-600'}`}>
              About
            </Link>
            <div className="border-t"></div>
            <div>
              <div className={`font-semibold mb-2 flex items-center justify-between py-2 ${pathname?.startsWith('/Catalog') ? 'text-black font-bold' : 'text-gray-600'}`}>
                <Link href="/Catalog" onClick={() => setMobileMenuOpen(false)} className="flex-1 cursor-pointer hover:text-black transition-colors">
                  Catalog
                </Link>
                <button 
                  onClick={() => setCatalogOpen(!catalogOpen)}
                  className="cursor-pointer px-2"
                >
                  <span className={`transition-transform inline-block ${catalogOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
              </div>
              {catalogOpen && (
                <div className="flex flex-col gap-3 pl-4 mt-2">
                  <Link href="/Catalog?category=Living" onClick={() => { setMobileMenuOpen(false); setCatalogOpen(false); }} className="text-gray-600 hover:text-black text-sm py-1 transition-colors">
                    Living
                  </Link>
                  <Link href="/Catalog?category=Bedroom" onClick={() => { setMobileMenuOpen(false); setCatalogOpen(false); }} className="text-gray-600 hover:text-black text-sm py-1 transition-colors">
                    Bedroom
                  </Link>
                  <Link href="/Catalog?category=Wardrobes" onClick={() => { setMobileMenuOpen(false); setCatalogOpen(false); }} className="text-gray-600 hover:text-black text-sm py-1 transition-colors">
                    Wardrobes
                  </Link>
                  <Link href="/Catalog?category=Kitchen" onClick={() => { setMobileMenuOpen(false); setCatalogOpen(false); }} className="text-gray-600 hover:text-black text-sm py-1 transition-colors">
                    Kitchen
                  </Link>
                </div>
              )}
            </div>
            <div className="border-t"></div>
            <Link href="/designyourown" onClick={() => setMobileMenuOpen(false)} className={`hover:text-black font-medium py-2 transition-colors ${pathname === '/designyourown' ? 'text-black font-bold' : 'text-gray-600'}`}>
              Design Your Own
            </Link>
            <div className="border-t"></div>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={`hover:text-black font-medium py-2 transition-colors ${pathname === '/contact' ? 'text-black font-bold' : 'text-gray-600'}`}>
              Contact
            </Link>
            <div className="border-t"></div>
            <Link href="/Blog" onClick={() => setMobileMenuOpen(false)} className={`hover:text-black font-medium py-2 transition-colors ${pathname === '/Blog' ? 'text-black font-bold' : 'text-gray-600'}`}>
              Blog
            </Link>
          </div>
        </div>
      )}
    </>
  );
}


