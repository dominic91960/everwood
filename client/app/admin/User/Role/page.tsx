"use client";

import { useState } from "react";
import { DataTable } from "./DataTable";
import { columns } from "./columns";
import { FaSearch } from "react-icons/fa";


const AllUsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock user data with various roles
  const users = [
    {
      id: "1",

      role: "Super Admin"
    },
    {
      id: "2",

      role: "Content Manager"
    },

    {
      id: "5",

      role: "Admin"
    },
    {
      id: "6",

      role: "User"
    },
    {
      id: "7",

      role: "Support Agent"
    },
    {
      id: "8",

      role: "Analyst"
    },
    {
      id: "9",

      role: "Team Lead"
    },

  ];

  // Filter users by role only
  const filteredUsers = users.filter((user) => {
    return searchTerm === "" ||
           user.role.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return (
    <div>
      <div className="container mx-auto">
        {/* Customer Table with Sorting & Search */}
        <div className="mt-6 rounded-2xl   sm:gap-0">
          <div className="grid flex-wrap gap-4 sm:mb-6 sm:items-center sm:justify-between sm:gap-2 md:flex">
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-[28px] font-bold text-gray-900 sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[30px]">
                  Users
                </h1>
                <span className="mt-2 text-[17px] font-semibold text-gray-700 sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[20px]">
                  User Roles
                </span>
              </div>
            </div>

            <div className=" grid flex-wrap gap-4 sm:flex sm:gap-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[220px] rounded-3xl border border-gray-300 bg-white px-3 py-3 pl-10 text-[14px] text-gray-900 placeholder:text-gray-400 md:w-[250px] lg:w-[280px] xl:w-[285px] 2xl:w-[285px]"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-[14px] text-gray-400 xl:-translate-y-1" />
              </div>

              {/* Status Filter */}
              {/* <div className="relative mt-[7px] mr-[50px] rounded-2xl bg-[#F9FBFF]">
                <label className="text-[12px]">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="items-center bg-[#F9FBFF] px-3 py-1 text-[12px]"
                >
                  <option value="all">All</option>
                  <option
                    value="Pending"
                    className="font-poppins text-[#0F5FC2]"
                  >
                    Pending
                  </option>
                  <option
                    value="Accepted"
                    className="font-poppins text-[#00AC4F]"
                  >
                    Accepted
                  </option>
                  <option
                    value="Declined"
                    className="font-poppins text-[#D0004B]"
                  >
                    Declined
                  </option>
                </select>
              </div> */}

              {/* Class Filter */}
              {/* <div className="relative mt-[7px] mr-[50px] rounded-2xl bg-[#F9FBFF]">
                <label className="text-[12px]">Class:</label>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="font-poppins items-center bg-[#F9FBFF] px-2 py-1 text-[12px]"
                >
                  <option value="all" className="font-poppins">
                    All Classes
                  </option>
                  <option value="18_24_MONTHS">Month(18-24)</option>
                  <option value="TODDLER">Toddler(2-3)</option>
                  <option value="PRE_K1">Pre K1(3-4)</option>
                  <option value="SECOND_YEAR">2nd Year(4-5)</option>
                  <option value="THIRD_YEAR">Kindergarten(5-6)</option>
                </select>
              </div> */}
            </div>
          </div>

          <div className="mt-[10px] sm:mt-0">
            <DataTable columns={columns} data={filteredUsers} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsersTable;
