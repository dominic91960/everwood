import React, { useState, useEffect } from "react";
import Editbutton from "./Editbutton";
import { couponApi, Coupon } from "@/lib/api/couponApi";

interface VeiwCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponId?: string;
}

export default function VeiwCouponModal({
  isOpen,
  onClose,
  couponId,
}: VeiwCouponModalProps) {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && couponId) {
      fetchCoupon();
    }
  }, [isOpen, couponId]);

  const fetchCoupon = async () => {
    if (!couponId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await couponApi.getCouponById(couponId);
      setCoupon(data);
    } catch (err) {
      console.error('Error fetching coupon:', err);
      setError('Failed to fetch coupon details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#00000033]/20 backdrop-blur-[500px] rounded-2xl shadow-lg w-[650px] p-6 relative border border-[#6E6E6E]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 bg-[#028EFC47] p-2 border border-[#1E2A45] rounded-full w-8 h-8 flex items-center justify-center text-white hover:bg-[#1E2A45]"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-white text-2xl font-bold mb-6">View Coupons</h2>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="text-white">Loading coupon details...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        {coupon && !loading && (
          <form className="grid grid-cols-2 gap-8 items-start">
            {/* Left Side */}
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 text-sm">Coupon Title</label>
                <input
                  type="text"
                  value={coupon.title}
                  readOnly
                  className="w-full h-10 px-3 text-[15px] bg-transparent border border-[#1E2A45] rounded-md text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2 text-sm">Code</label>
                <input
                  type="text"
                  value={coupon.code}
                  readOnly
                  className="w-full h-10 px-3 text-[15px] bg-transparent border border-[#1E2A45] rounded-md text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2 text-sm">Start Date</label>
                <input
                  type="date"
                  value={new Date(coupon.startDate).toISOString().split('T')[0]}
                  readOnly
                  className="w-full h-10 px-3 text-[15px] bg-transparent border border-[#1E2A45] rounded-md text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 text-sm">Coupon Type</label>
                <select
                  value={coupon.couponType}
                  disabled
                  className="w-full h-10 px-3 text-[15px] bg-transparent border border-[#1E2A45] rounded-md text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="percentage" className="bg-[#0A0F1C]">
                    Percentage
                  </option>
                  <option value="exact" className="bg-[#0A0F1C]">
                    Exact Amount
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 text-sm">Amount/Percentage</label>
                <input
                  type="text"
                  value={coupon.value}
                  readOnly
                  className="w-full h-10 px-3 text-[15px] bg-transparent border border-[#1E2A45] rounded-md text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2 text-sm">End Date</label>
                <input
                  type="date"
                  value={new Date(coupon.endDate).toISOString().split('T')[0]}
                  readOnly
                  className="w-full h-10 px-3 text-[15px] bg-transparent border border-[#1E2A45] rounded-md text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}