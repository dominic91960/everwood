"use client";

import { useState, useEffect } from "react";
import { DataTable } from "./DataTable";
import { createColumns } from "./columns";
import { FaSearch } from "react-icons/fa";
import AddButton from './AddButton'
import AddCouponModal from './AddCouponModal'
import { couponApi, Coupon } from "@/lib/api/couponApi"

const AllProductsTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch coupons from API
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                setLoading(true);
                const data = await couponApi.getCoupons();
                setCoupons(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching coupons:', err);
                setError('Failed to fetch coupons');
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, []);

    // Refresh coupons after adding a new one
    const handleCouponAdded = async () => {
        try {
            const data = await couponApi.getCoupons();
            setCoupons(data);
        } catch (err) {
            console.error('Error refreshing coupons:', err);
        }
    };

    // Transform coupons data for table display
    const transformedCoupons = coupons.map((coupon) => ({
        id: coupon._id,
        discount: coupon.couponType === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`,
        couponTitle: coupon.title,
        code: coupon.code,
        CouponType: coupon.couponType,
        startDate: new Date(coupon.startDate).toLocaleDateString(),
        endDate: new Date(coupon.endDate).toLocaleDateString(),
        status: new Date(coupon.endDate) < new Date() ? 'Expired' : 'Active',
        value: coupon.value,
        originalCoupon: coupon
    }));

    // Enhanced filtering logic
    const filteredProducts = transformedCoupons.filter((product) => {
        // Coupon title search
        const nameMatches =
            searchTerm === "" ||
            (product.couponTitle &&
                product.couponTitle
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()));

        // Status filter
        const statusMatches = statusFilter === "" || product.status === statusFilter;

        return nameMatches && statusMatches;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white">Loading coupons...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }
    return (
        <div>
            <div className="container mx-auto">
                {/* Student Table with Sorting & Search */}
                <div className="mt-6 rounded-2xl   sm:gap-0">
                    <div className="grid flex-wrap gap-4 sm:mb-6 sm:items-center sm:justify-between sm:gap-2 md:flex">
                        <div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-[28px] font-bold sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[30px] text-[#E5E5E5]">
                                    Coupons
                                </h1>
                                <span className="text-[17px] text-[#E5E5E5] font-semibold sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[20px] mt-2">
                                    All Coupons
                                </span>
                            </div>
                        </div>

                        <div className=" grid flex-wrap gap-4 sm:flex sm:gap-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search For..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-[180px] rounded-3xl bg-[#0B1739] px-3 pl-10 py-3 md:w-[250px] lg:w-[280px] xl:w-[285px] 2xl:w-[285px] border-[#FFFFFF33]/20 text-[14px]"
                                />
                                <FaSearch className="absolute top-1/2 left-3 xl:-translate-y-1 -translate-y-1/2 transform text-[#AEB9E1] text-[14px]" />
                            </div>

                            {/* Status Filter */}
                            <div className="relative md:mr-0 ml-[-10px]  md:w-[170px] w-[150px]  md:py-0 py-2  px-3 rounded-3xl">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-[150px] rounded-3xl bg-[#0B1739] px-4 py-3 border border-[#FFFFFF33]/20 text-[14px] text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#AEB9E1]/50 focus:border-[#AEB9E1]/50 transition-all duration-200 hover:border-[#AEB9E1]/30"
                                >
                                    <option value="" className="bg-[#0B1739] text-white py-2">All Status</option>
                                    <option value="Active" className="bg-[#0B1739] text-white py-2">Active</option>
                                    <option value="Expired" className="bg-[#0B1739] text-white py-2">Expired</option>
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-4 h-4 text-[#AEB9E1] transition-transform duration-200"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Add button */}
                            <div className="relative mt-[7px]  ">
                                <AddButton
                                    identifier="add-product"
                                    buttonText="Add Coupon"
                                    onClick={() => setIsModalOpen(true)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-[10px] sm:mt-0">
                        <DataTable columns={createColumns(handleCouponAdded)} data={filteredProducts} />
                    </div>
                </div>
            </div>

            {/* Add Coupon Modal */}
            <AddCouponModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCouponAdded={handleCouponAdded}
            />
        </div>
    );
};

export default AllProductsTable;
