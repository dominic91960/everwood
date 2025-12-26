"use client";
import { useState } from "react";
import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaPlus,
  FaList,
  FaTachometerAlt,
  FaBoxOpen,
  FaPlusSquare,
  FaUsers,
  FaUserPlus,
  FaUser,
  FaShoppingCart,
  FaTicketAlt,
  FaUserCircle,
  FaBoxes,
  FaCreditCard,
} from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { BiCustomize } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBlogDropdownOpen, setIsBlogDropdownOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string): boolean => pathname === path;

  return (
    <>
      {/* Hamburger Icon for Mobile */}
      <div>
        <button
          className="fixed top-4 left-1 z-50 rounded-md p-2 text-2xl text-black xl:hidden"
          onClick={() => setIsOpen(!isOpen)} // Toggle Sidebar
        >
          {isOpen ? (
            <AiOutlineClose
              size={24}
              className="ml-[200px] text-white md:ml-[250px]"
            />
          ) : (
            <GiHamburgerMenu size={24} />
          )}
        </button>

        {/* Sidebar (Mobile Overlay) */}
        {isOpen && (
          <div
            className="bg-opacity-50 fixed inset-0 z-40 xl:hidden"
            onClick={() => setIsOpen(false)} // Close sidebar when clicking outside
          ></div>
        )}
      </div>

      {/* Sidebar */}
      <div className="h-screen xl:px-3 xl:py-3 2xl:px-5">
        <div
          className={`fixed top-0 left-0 z-40 container mx-auto h-full w-[270px] overflow-auto rounded-2xl border border-white/10 bg-black/30 text-[#9197B3] backdrop-blur-[500px] transition-transform md:w-[300px] xl:w-[300px] xl:px-3 2xl:w-[300px] ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } xl:relative xl:block xl:translate-x-0 2xl:translate-x-0`}
        >
          <div className="flex px-18 py-5">
            <h1 className="sm:text[16px] text-[14px] font-bold text-[#FFFFFF] md:text-[20px] xl:text-[32px]">
              TECHCD
            </h1>
          </div>
          <nav className="px-4 py-7">
            <ul className="space-y-3">
              <li
                className={`flex items-center space-x-4 rounded-xl px-6 py-2 ${
                  isActive("/admin")
                    ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                    : ""
                }`}
              >
                <FaTachometerAlt className="h-[20px] w-[20px]" />
                <Link
                  href="/admin"
                  className="text-[16px] font-semibold text-[#E5E5E5]"
                >
                  Dashboard
                </Link>
              </li>

              {/* Blog Dropdown */}
              <li className="relative">
                <button
                  className={`flex w-full items-center justify-between rounded-md px-6 py-2 ${
                    isActive("")
                      ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                      : ""
                  }`}
                  onClick={() => setIsBlogDropdownOpen((prev) => !prev)}
                >
                  <div className="flex items-center space-x-4">
                    <FaUser className="h-[20px] w-[20px]" />
                    <span className="text-[16px] font-semibold text-[#E5E5E5]">
                      Blogs
                    </span>
                  </div>
                  {isBlogDropdownOpen ? (
                    <IoMdArrowDropup />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </button>

                {isBlogDropdownOpen && (
                  <ul className="mt-2 ml-8 space-y-2">
                    <li
                      className={`ml-[-30px] flex items-center space-x-3 rounded-md py-2 pr-8 pl-[50px] ${
                        isActive("/admin/blog/all-blogs")
                          ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                          : ""
                      }`}
                    >
                      <FaList className="h-[20px] w-[20px]" />
                      <Link
                        href="/admin/blog/all-blogs"
                        className="text-[16px] font-semibold text-[#E5E5E5]"
                      >
                        All Blogs
                      </Link>
                    </li>
                    <li
                      className={`ml-[-30px] flex items-center space-x-3 rounded-md py-2 pr-8 pl-[50px] ${
                        isActive("/admin/blog/add-blog")
                          ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                          : ""
                      }`}
                    >
                      <FaPlus className="h-[20px] w-[20px]" />
                      <Link
                        href="/admin/blog/add-blog"
                        className="text-[16px] font-semibold text-[#E5E5E5]"
                      >
                        Add Blog
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li className="relative">
                <button
                  className={`flex w-full items-center justify-between rounded-3xl px-6 py-2 ${
                    isActive("/admin/Product")
                      ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                      : ""
                  }`}
                  onClick={() => setIsProductDropdownOpen((prev) => !prev)}
                >
                  <div className="flex items-center space-x-4">
                    <FaBoxOpen className="h-[20px] w-[20px]" />
                    <span className="text-[16px] font-semibold text-[#E5E5E5]">
                      Products
                    </span>
                  </div>
                  {isProductDropdownOpen ? (
                    <IoMdArrowDropup />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </button>

                {isProductDropdownOpen && (
                  <ul className="mt-2 ml-8 space-y-2">
                    <li
                      className={`ml-[-30px] flex items-center space-x-3 rounded-md py-2 pr-8 pl-[50px] ${
                        isActive("/admin/Product/All-product")
                          ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                          : ""
                      }`}
                    >
                      <FaBoxes className="h-[20px] w-[20px]" />
                      <Link
                        href="/admin/Product/All-product"
                        className="text-[16px] font-semibold text-[#E5E5E5]"
                      >
                        All Products
                      </Link>
                    </li>

                    <li
                      className={`ml-[-30px] flex items-center space-x-3 rounded-md py-2 pr-8 pl-[50px] ${
                        isActive("/admin/Product/add-product")
                          ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                          : ""
                      }`}
                    >
                      <FaPlusSquare className="h-[20px] w-[20px]" />
                      <Link
                        href="/admin/Product/add-product"
                        className="text-[16px] font-semibold text-[#E5E5E5]"
                      >
                        Create Product
                      </Link>
                    </li>
                    <li
                      className={`ml-[-30px] flex items-center space-x-3 rounded-md py-2 pr-8 pl-[50px] ${
                        isActive("/admin/Product/Category")
                          ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                          : ""
                      }`}
                    >
                      <MdCategory className="h-[20px] w-[20px]" />
                      <Link
                        href="/admin/Product/Category"
                        className="text-[16px] font-semibold text-[#E5E5E5]"
                      >
                        Category
                      </Link>
                    </li>
                    <li
                      className={`ml-[-30px] flex items-center space-x-3 rounded-md py-2 pr-8 pl-[50px] ${
                        isActive("/admin/Product/Attribute")
                          ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                          : ""
                      }`}
                    >
                      <BiCustomize className="h-[20px] w-[20px]" />
                      <Link
                        href="/admin/Product/Attribute"
                        className="text-[16px] font-semibold text-[#E5E5E5]"
                      >
                        Attribute
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Customer Section */}
              <li
                className={`flex items-center space-x-4 rounded-md px-6 py-2 ${
                  isActive("/admin/Customer/All-Customer")
                    ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                    : ""
                }`}
              >
                <FaUsers className="h-[20px] w-[20px]" />
                <Link
                  href="/admin/Customer/All-Customer"
                  className="text-[16px] font-semibold text-[#E5E5E5]"
                >
                  Customers
                </Link>
              </li>

              <li className="relative">
                <button
                  className={`flex w-full items-center justify-between rounded-md px-6 py-2 ${
                    isActive("")
                      ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                      : ""
                  }`}
                  onClick={() => setIsUserDropdownOpen((prev) => !prev)} // Toggle Gallery Dropdown
                >
                  <div className="flex items-center space-x-4">
                    <FaUser className="h-[20px] w-[20px]" />
                    <span className="text-[16px] font-semibold text-[#E5E5E5]">
                      Users
                    </span>
                  </div>
                  {isUserDropdownOpen ? (
                    <IoMdArrowDropup />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </button>

                {isUserDropdownOpen && (
                  <ul className="mt-2 ml-8 space-y-2">
                    <li
                      className={`ml-[-30px] flex items-center space-x-3 rounded-md py-2 pr-8 pl-[50px] ${
                        isActive("/admin/User/All-user")
                          ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                          : ""
                      }`}
                    >
                      <FaUsers className="h-[20px] w-[20px]" />
                      <Link
                        href="/admin/User/All-user"
                        className="text-[16px] font-semibold text-[#E5E5E5]"
                      >
                        All Users
                      </Link>
                    </li>
                    <li
                      className={`ml-[-30px] flex items-center space-x-3 rounded-md py-2 pr-8 pl-[50px] ${
                        isActive("/admin/User/Add-user")
                          ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                          : ""
                      }`}
                    >
                      <FaUserPlus className="h-[20px] w-[20px]" />
                      <Link
                        href="/admin/User/Add-user"
                        className="text-[16px] font-semibold text-[#E5E5E5]"
                      >
                        Add Users
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li
                className={`flex items-center space-x-4 rounded-md px-6 py-2 ${
                  isActive("/admin/Order")
                    ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                    : ""
                }`}
              >
                <FaShoppingCart className="h-[20px] w-[20px]" />
                <Link
                  href="/admin/Order"
                  className="text-[16px] font-semibold text-[#E5E5E5]"
                >
                  Orders
                </Link>
              </li>

              <li
                className={`flex items-center space-x-4 rounded-md px-6 py-2 ${
                  isActive("/admin/coupon")
                    ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                    : ""
                }`}
              >
                <FaTicketAlt className="h-[20px] w-[20px]" />
                <Link
                  href="/admin/coupon"
                  className="text-[16px] font-semibold text-[#E5E5E5]"
                >
                  Coupons
                </Link>
              </li>

              <li
                className={`flex items-center space-x-4 rounded-md px-6 py-2 ${
                  isActive("/admin/Payment")
                    ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                    : ""
                }`}
              >
                <FaCreditCard className="h-[20px] w-[20px]" />
                <Link
                  href="/admin/Payment"
                  className="text-[16px] font-semibold text-[#E5E5E5]"
                >
                  Payment Settings
                </Link>
              </li>

              <li
                className={`flex items-center space-x-4 rounded-md px-6 py-2 ${
                  isActive("/admin/Profile")
                    ? "bg-gradient-to-r from-[#43A8F7] to-[#028EFC] text-white"
                    : ""
                }`}
              >
                <FaUserCircle className="h-[20px] w-[20px]" />
                <Link
                  href="/admin/Profile"
                  className="text-[16px] font-semibold text-[#E5E5E5]"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
