"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaPen,
  FaImage,
  FaCalendarAlt,
  FaPlus,
  FaList,
  FaTags,
  FaUser,
} from "react-icons/fa";
import { usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string): boolean => pathname === path;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Hamburger Icon for Mobile */}
      <div>
        <button
          className="fixed top-4 left-1 z-50 p-2 text-2xl rounded-md xl:hidden  text-black"
          onClick={() => setIsOpen(!isOpen)} // Toggle Sidebar
        >
          {isOpen ? <AiOutlineClose size={24} className="text-white md:ml-[250px] ml-[200px]" /> : <GiHamburgerMenu size={24} />}
        </button>

        {/* Sidebar (Mobile Overlay) */}
        {isOpen && (
          <div
            className="fixed inset-0  bg-opacity-50 z-40 xl:hidden"
            onClick={() => setIsOpen(false)} // Close sidebar when clicking outside
          ></div>
        )}
      </div>

      {/* Sidebar */}
      <div className="2xl:px-5 xl:px-3 xl:py-3 ">
        <div
          className={`fixed left-0 z-40 rounded-2xl top-0 min-h-screen w-[270px] md:w-[300px] container mx-auto 2xl:w-[300px] xl:w-[300px] bg-[#201F31] xl:px-3 text-[#9197B3] shadow-[0_10px_60px_rgba(226,236,249,0.5)] transition-transform 
    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
    xl:translate-x-0 2xl:translate-x-0 xl:relative xl:block`}
        >
          <div className="flex space-x-3 py-5 px-5">
            <h1 className=" xl:text-[20px] text-[14px] sm:text[16px] md:text-[20px] font-bold text-[#FFFFFF] ">
            Ever Wood Collection 

            </h1>
          </div>
          <nav className="py-7">
            <ul className="space-y-3">
              {/* <li
                className={`flex items-center space-x-4 px-6 py-2 rounded-3xl ${isActive("/admin") ? "bg-[#2CAB6D] text-white" : ""
                  }`}
              >
                <FaTachometerAlt className="xl:text-[14px] text-[10px]" />
                <Link href="/admin">Admissions</Link>
              </li>

              <li
                className={`flex items-center space-x-4 px-6 py-2 rounded-3xl ${isActive("/admin/Student") ? "bg-[#2CAB6D] text-white" : ""
                  }`}
              >
                <FaUserGraduate className="xl:text-[14px] text-[12px]" />
                <Link href="/admin/Student">Students</Link>
              </li> */}

              {/* Blog Dropdown */}
              <li className="relative">
                <button
                  className={`flex items-center justify-between w-full px-6 py-2 rounded-3xl ${isActive("/admin/blog") ? "bg-[#2CAB6D] text-white" : ""
                    }`}
                  onClick={() => setIsBlogOpen(!isBlogOpen)}
                >
                  <div className="flex items-center space-x-4">
                    <FaPen className="text-[14px]" />
                    <span>Blog</span>
                  </div>
                  {isBlogOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                </button>

                {isBlogOpen && (
                  <ul className="ml-8 mt-2 space-y-2  pl-4">
                    <li
                      className={`flex items-center space-x-3 px-6 py-2 rounded-3xl ${isActive("/admin/blog/all-blogs") ? "bg-[#2CAB6D] text-white" : ""
                        }`}
                    >
                      <FaList className="text-[14px]" />
                      <Link href="/admin/blog/all-blogs">All Blog</Link>
                    </li>
                    <li
                      className={`flex items-center space-x-3 px-6 py-2 rounded-3xl ${isActive("/admin/blog/add-blog") ? "bg-[#2CAB6D] text-white" : ""
                        }`}
                    >
                      <FaPlus className="text-[14px]" />
                      <Link href="/admin/blog/add-blog">Add Blog</Link>
                    </li>
                    {/* <li className={`flex items-center space-x-3 px-6 py-2 rounded-3xl ${isActive("/admin/blog/blog-categories") ? "bg-[#2CAB6D] text-white" : ""}`}>
                      <FaTags className="text-[14px]" />
                      <Link href="/admin/blog/blog-categories">Categories</Link>
                    </li>
                    <li className={`flex items-center space-x-3 px-6 py-2 rounded-3xl ${isActive("/admin/blog/blog-tags") ? "bg-[#2CAB6D] text-white" : ""}`}>
                      <FaTags className="text-[14px]" />
                      <Link href="/admin/blog/blog-tags">Tag</Link>
                    </li> */}
                  </ul>
                )}
              </li>

              {/* Event Dropdown */}
              {/* <li className="relative">
                <button
                  className={`flex items-center justify-between w-full px-6 py-2 rounded-3xl ${isActive("/admin/Event") ? "bg-[#2CAB6D] text-white" : ""
                    }`}
                  onClick={() => setIsEventOpen(!isEventOpen)}
                >
                  <div className="flex items-center space-x-4">
                    <FaCalendarAlt className="text-[14px]" />
                    <span>Event</span>
                  </div>
                  {isEventOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                </button>

                {isEventOpen && (
                  <ul className="ml-8 mt-2 space-y-2  pl-4">
                    <li
                      className={`flex items-center space-x-3 px-6 py-2 rounded-3xl  ${isActive("/admin/event/all-event") ? "bg-[#2CAB6D] text-white" : ""
                        }`}
                    >
                      <FaList className="text-[14px]" />
                      <Link href="/admin/event/all-event">All Events</Link>
                    </li>
                    <li
                      className={`flex items-center space-x-3 px-6 py-2   rounded-3xl ${isActive("/admin/event/add-event") ? "bg-[#2CAB6D] text-white" : ""
                        }`}
                    >
                      <FaPlus className="text-[14px]" />
                      <Link href="/admin/event/add-event">Add Event</Link>
                    </li>
                  </ul>
                )}
              </li> */}

              {/* <li className="relative">
                <button
                  className={`flex items-center justify-between w-full px-6 py-2 rounded-3xl ${isActive("") ? "bg-[#2CAB6D] text-white" : ""}`}
                  onClick={() => setIsGalleryOpen(!isGalleryOpen)} // Toggle Gallery Dropdown
                >
                  <div className="flex items-center space-x-4">
                    <FaImage className="text-[14px]" />
                    <span>Gallery</span>
                  </div>
                  {isGalleryOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                </button>

                {isGalleryOpen && (
                  <ul className="ml-8 mt-2 space-y-2 pl-4">
                    <li
                      className={`flex items-center space-x-4 px-6 py-2 rounded-3xl ${isActive("/admin/gallery") ? "bg-[#2CAB6D] text-white" : ""}`}
                    >
                      <FaList className="text-[14px]" />
                      <Link href="/admin/gallery">All Gallery</Link>
                    </li>
                    <li
                      className={`flex items-center space-x-4 px-6 py-2 rounded-3xl ${isActive("/admin/gallery/gallery-category") ? "bg-[#2CAB6D] text-white" : ""}`}
                    >
                      <FaTags className="text-[14px]" />
                      <Link href="/admin/gallery/gallery-category"> Categories</Link>
                    </li>
                  </ul>
                )}
              </li> */}
              {/* <li
                className={`flex items-center space-x-4 px-6 py-2 rounded-3xl ${isActive("/admin/Profile") ? "bg-[#2CAB6D] text-white" : ""
                  }`}
              >
                <FaUser className="xl:text-[14px] text-[12px]" />
                <Link href="/admin/Profile">Profile</Link>
              </li> */}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-4 px-6 py-2 rounded-3xl w-full text-left hover:bg-red-600 hover:text-white transition-colors"
                >
                  <FiLogOut className="xl:text-[14px] text-[12px]" />
                  <span>Log out</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;