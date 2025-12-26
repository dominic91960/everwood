"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

import { useAuthStore } from "@/store/auth-store";
import { columns } from "./columns";
import { DataTable } from "./DataTable";
import { getUsers, User } from "../../../../lib/api/userApi";

const AllUsersTable = () => {
  const { authToken } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users...");
      const fetchedUsers = await getUsers(authToken);
      console.log("Fetched users:", fetchedUsers);
      setUsers(fetchedUsers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Listen for user delete events to refresh the table
  useEffect(() => {
    const handleUserDeleted = () => {
      fetchUsers();
      setSuccessMessage("User deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000); // Auto-hide after 3 seconds
    };

    window.addEventListener("userDeleted", handleUserDeleted);

    return () => {
      window.removeEventListener("userDeleted", handleUserDeleted);
    };
  }, []);

  // Transform API data to match table structure
  const transformedUsers = users.map((user) => {
    console.log("Transforming user:", user);
    return {
      id: user._id,
      userImage: user.avatar ?? "/images/sample-img.jpg", // Default image since API doesn't provide one
      userName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role?.name || "Unknown",
    };
  });

  // Enhanced filtering logic
  const filteredUsers = transformedUsers.filter((user) => {
    // User name search
    const nameMatches =
      searchTerm === "" ||
      (user.userName &&
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Email search
    const emailMatches =
      searchTerm === "" ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    // Role search
    const roleMatches =
      searchTerm === "" ||
      (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()));

    return nameMatches || emailMatches || roleMatches;
  });
  return (
    <div>
      <div className="container mx-auto">
        {/* Customer Table with Sorting & Search */}
        <div className="mt-6 rounded-2xl sm:gap-0">
          <div className="grid flex-wrap gap-4 sm:mb-6 sm:items-center sm:justify-between sm:gap-2 md:flex">
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-[28px] font-bold text-gray-900 sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[30px]">
                  Users
                </h1>
                <span className="mt-2 text-[17px] font-semibold text-gray-700 sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[20px]">
                  All User
                </span>
              </div>
            </div>

            <div className="grid flex-wrap gap-4 sm:flex sm:gap-4">
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

              {/* Refresh Button */}
              {/* <button
                onClick={fetchUsers}
                disabled={loading}
                className="px-4 py-3 rounded-3xl bg-[#0B1739] border-[#FFFFFF33]/20 text-[#E5E5E5] hover:bg-[#1a2a5a] transition-colors disabled:opacity-50"
                title="Refresh users"
              >
                <FiRefreshCw className={`text-[14px] ${loading ? 'animate-spin' : ''}`} />
              </button> */}

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

          {/* Debug Info */}
          {/* <div className="mt-4 p-3 rounded-md bg-blue-500/20 border border-blue-500 text-blue-400 text-sm">
            <p>Debug Info:</p>
            <p>Users count: {users.length}</p>
            <p>Transformed users count: {transformedUsers.length}</p>
            <p>Filtered users count: {filteredUsers.length}</p>
            <p>Loading: {loading.toString()}</p>
            <p>Error: {error || 'None'}</p>
          </div> */}

          {/* Loading and Error States */}
          {loading && (
            <div className="mt-4 text-center text-gray-600">
              Loading users...
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-md border border-red-500 bg-red-500/20 p-3 text-red-400">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 rounded-md border border-green-500 bg-green-500/20 p-3 text-green-400">
              {successMessage}
            </div>
          )}

          {!loading && !error && (
            <div className="mt-[10px] sm:mt-0">
              <DataTable columns={columns} data={filteredUsers} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsersTable;
