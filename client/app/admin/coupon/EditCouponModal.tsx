import React, { useState, useEffect } from "react";
import Editbutton from "./Editbutton";
import { couponApi, Coupon, UpdateCouponData } from "@/lib/api/couponApi";

export default function EditCouponModal({
  isOpen,
  onClose,
  couponId,
  onCouponUpdated,
}: {
  isOpen: boolean;
  onClose: () => void;
  couponId?: string;
  onCouponUpdated?: () => void;
}) {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<UpdateCouponData>({
    title: '',
    couponType: 'percentage',
    code: '',
    value: 0,
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setFormData({
        title: data.title,
        couponType: data.couponType,
        code: data.code,
        value: data.value,
        startDate: new Date(data.startDate).toISOString().split('T')[0],
        endDate: new Date(data.endDate).toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Error fetching coupon:', err);
      setError('Failed to fetch coupon details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponId) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      await couponApi.updateCoupon(couponId, formData);
      onCouponUpdated?.();
      onClose();
    } catch (err) {
      console.error('Error updating coupon:', err);
      setError(err instanceof Error ? err.message : 'Failed to update coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#00000033]/20 backdrop-blur-[500px] rounded-2xl shadow-lg w-[650px] p-6 relative border border-[#172D6D]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 bg-[#028EFC47] p-2 border border-[#1E2A45] rounded-full w-8 h-8 flex items-center justify-center text-white hover:bg-[#1E2A45]"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-white text-2xl font-bold mb-6">Edit Coupons</h2>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="text-white">Loading coupon details...</div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        {!loading && (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8 items-start">
            {/* Left Side */}
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 text-sm">Coupon Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full h-10 px-3 text-[15px] bg-transparent border border-[#1E2A45] rounded-md text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2 text-sm">Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  className="w-full h-10 px-3 text-[15px] bg-transparent border border-[#1E2A45] rounded-md text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2 text-sm">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full h-10 px-3 text-[15px] bg-transparent border border-[#1E2A45] rounded-md text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 text-sm">Coupon Type</label>
                <select
                  name="couponType"
                  value={formData.couponType}
                  onChange={handleInputChange}
                  required
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
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full h-10 px-3 text-[15px] bg-transparent border border-[#1E2A45] rounded-md text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2 text-sm">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full h-10 px-3 text-[15px] bg-transparent border border-[#1E2A45] rounded-md text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </form>
        )}

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <Editbutton 
            identifier="edit-coupon" 
            buttonText={isSubmitting ? "Updating..." : "Edit Coupon"}
            onClick={handleSubmit}
            disabled={isSubmitting || loading}
          />
        </div>
      </div>
    </div>
  );
}
