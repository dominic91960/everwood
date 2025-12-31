"use client";
import { useState } from "react";
import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaPen,
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
          className="fixed top-4 left-1 z-50 rounded-md p-2 text-2xl xl:hidden"
          onClick={() => setIsOpen(!isOpen)} // Toggle Sidebar
        >
          {isOpen ? (
            <AiOutlineClose size={24} className="ml-[200px] md:ml-[250px]" />
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
          className={`fixed top-0 left-0 z-40 container mx-auto h-full w-[270px] overflow-auto rounded-2xl border border-gray-200 bg-[#4A4A4A] text-white shadow-sm transition-transform md:w-[300px] xl:w-[300px] xl:px-3 2xl:w-[300px] ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } xl:relative xl:block xl:translate-x-0 2xl:translate-x-0`}
        >
          <h1 className="sm:text[16px] ps-10 py-5 text-[14px] font-bold md:text-[20px] xl:text-[32px]">
            Everwood
          </h1>
          <nav className="px-4 py-7">
            <ul className="space-y-3">
              <li
                className={`flex items-center space-x-4 rounded-xl px-6 py-2 ${
                  isActive("/admin")
                    ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                    : ""
                }`}
              >
                <FaTachometerAlt className="h-5 w-5" />
                <Link href="/admin" className="text-[16px] font-semibold ">
                  Dashboard
                </Link>
              </li>

              {/* Blog Dropdown */}
              <li className="relative">
                <button
                  className={`flex w-full items-center justify-between rounded-md px-6 py-2 ${
                    isActive("")
                      ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                      : ""
                  }`}
                  onClick={() => setIsBlogDropdownOpen((prev) => !prev)}
                >
                  <div className="flex items-center space-x-4">
                    <FaPen className="h-5 w-5" />
                    <span className="text-[16px] font-semibold ">Blogs</span>
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
                          ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                          : ""
                      }`}
                    >
                      <FaList className="h-5 w-5" />
                      <Link
                        href="/admin/blog/all-blogs"
                        className="text-[16px] font-semibold "
                      >
                        All Blogs
                      </Link>
                    </li>
                    <li
                      className={`ml-[-30px] flex items-center space-x-3 rounded-md py-2 pr-8 pl-[50px] ${
                        isActive("/admin/blog/add-blog")
                          ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                          : ""
                      }`}
                    >
                      <FaPlus className="h-5 w-5" />
                      <Link
                        href="/admin/blog/add-blog"
                        className="text-[16px] font-semibold "
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
                    isActive("/admin/product")
                      ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                      : ""
                  }`}
                  onClick={() => setIsProductDropdownOpen((prev) => !prev)}
                >
                  <div className="flex items-center space-x-4">
                    <FaBoxOpen className="h-5 w-5" />
                    <span className="text-[16px] font-semibold ">Products</span>
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
                        isActive("/admin/product/all-product")
                          ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                          : ""
                      }`}
                    >
                      <FaBoxes className="h-5 w-5" />
                      <Link
                        href="/admin/product/all-product"
                        className="text-[16px] font-semibold "
                      >
                        All Products
                      </Link>
                    </li>

                    <li
                      className={`ml-[-30px] flex items-center space-x-3 rounded-md py-2 pr-8 pl-[50px] ${
                        isActive("/admin/product/add-product")
                          ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                          : ""
                      }`}
                    >
                      <FaPlusSquare className="h-5 w-5" />
                      <Link
                        href="/admin/product/add-product"
                        className="text-[16px] font-semibold "
                      >
                        Create Product
                      </Link>
                    </li>
                    <li
                      className={`ml-[-30px] flex items-center space-x-3 rounded-md py-2 pr-8 pl-[50px] ${
                        isActive("/admin/product/category")
                          ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                          : ""
                      }`}
                    >
                      <MdCategory className="h-5 w-5" />
                      <Link
                        href="/admin/product/category"
                        className="text-[16px] font-semibold "
                      >
                        Category
                      </Link>
                    </li>
                    <li
                      className={`ml-[-30px] flex items-center space-x-3 rounded-md py-2 pr-8 pl-[50px] ${
                        isActive("/admin/product/attribute")
                          ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                          : ""
                      }`}
                    >
                      <BiCustomize className="h-5 w-5" />
                      <Link
                        href="/admin/product/attribute"
                        className="text-[16px] font-semibold "
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
                  isActive("/admin/customer/all-customer")
                    ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                    : ""
                }`}
              >
                <FaUsers className="h-5 w-5" />
                <Link
                  href="/admin/customer/all-customer"
                  className="text-[16px] font-semibold "
                >
                  Customers
                </Link>
              </li>

              <li className="relative">
                <button
                  className={`flex w-full items-center justify-between rounded-md px-6 py-2 ${
                    isActive("")
                      ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                      : ""
                  }`}
                  onClick={() => setIsUserDropdownOpen((prev) => !prev)} // Toggle Gallery Dropdown
                >
                  <div className="flex items-center space-x-4">
                    <FaUser className="h-5 w-5" />
                    <span className="text-[16px] font-semibold ">Users</span>
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
                        isActive("/admin/user/all-user")
                          ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                          : ""
                      }`}
                    >
                      <FaUsers className="h-5 w-5" />
                      <Link
                        href="/admin/user/all-user"
                        className="text-[16px] font-semibold "
                      >
                        All Users
                      </Link>
                    </li>
                    <li
                      className={`ml-[-30px] flex items-center space-x-3 rounded-md py-2 pr-8 pl-[50px] ${
                        isActive("/admin/user/add-user")
                          ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                          : ""
                      }`}
                    >
                      <FaUserPlus className="h-5 w-5" />
                      <Link
                        href="/admin/user/add-user"
                        className="text-[16px] font-semibold "
                      >
                        Add Users
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li
                className={`flex items-center space-x-4 rounded-md px-6 py-2 ${
                  isActive("/admin/order")
                    ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                    : ""
                }`}
              >
                <FaShoppingCart className="h-5 w-5" />
                <Link
                  href="/admin/order"
                  className="text-[16px] font-semibold "
                >
                  Orders
                </Link>
              </li>

              <li
                className={`flex items-center space-x-4 rounded-md px-6 py-2 ${
                  isActive("/admin/coupon")
                    ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                    : ""
                }`}
              >
                <FaTicketAlt className="h-5 w-5" />
                <Link
                  href="/admin/coupon"
                  className="text-[16px] font-semibold "
                >
                  Coupons
                </Link>
              </li>

              <li
                className={`flex items-center space-x-4 rounded-md px-6 py-2 ${
                  isActive("/admin/payment")
                    ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                    : ""
                }`}
              >
                <FaCreditCard className="h-5 w-5" />
                <Link
                  href="/admin/payment"
                  className="text-[16px] font-semibold "
                >
                  Payment Settings
                </Link>
              </li>

              <li
                className={`flex items-center space-x-4 rounded-md px-6 py-2 ${
                  isActive("/admin/profile")
                    ? "bg-linear-to-r from-[#43A8F7] to-[#028EFC]"
                    : ""
                }`}
              >
                <FaUserCircle className="h-5 w-5" />
                <Link
                  href="/admin/profile"
                  className="text-[16px] font-semibold "
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
