import React, { useState } from "react";
import Updatebutton from "./Updatebutton";
import { couponApi, CreateCouponData } from "@/lib/api/couponApi";

export default function AddCouponModal({
  isOpen,
  onClose,
  onCouponAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCouponAdded?: () => void;
}) {
  const [formData, setFormData] = useState<CreateCouponData>({
    title: '',
    couponType: 'percentage',
    code: '',
    value: 0,
    startDate: '',
    endDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await couponApi.createCoupon(formData);
      onCouponAdded?.();
      onClose();
      // Reset form
      setFormData({
        title: '',
        couponType: 'percentage',
        code: '',
        value: 0,
        startDate: '',
        endDate: ''
      });
    } catch (err) {
      console.error('Error creating coupon:', err);
      setError(err instanceof Error ? err.message : 'Failed to create coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-[650px] rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Add Coupons</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 items-start gap-8">
          {/* Left Side */}
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-700">Coupon Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[15px] text-gray-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700">Code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[15px] text-gray-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[15px] text-gray-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-700">Coupon Type</label>
              <select
                name="couponType"
                value={formData.couponType}
                onChange={handleInputChange}
                required
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[15px] text-gray-900 focus:outline-none focus:border-blue-500"
              >
                <option value="percentage">
                  Percentage
                </option>
                <option value="exact">
                  Exact Amount
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700">Amount/Percentage</label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                required
                min="0"
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[15px] text-gray-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[15px] text-gray-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </form>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <Updatebutton
            identifier="add-coupon"
            buttonText={isSubmitting ? "Adding..." : "Add Coupon"}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
