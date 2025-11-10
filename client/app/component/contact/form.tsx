"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

// Zod validation schema
const contactSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d\s\-\+\(\)]+$/, "Please enter a valid phone number"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

function Form() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await axios.post(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/contact/submit`,
        data
      );

      if (response.data.success) {
        setSubmitStatus({
          type: "success",
          message:
            "Thank you! Your message has been sent successfully. We'll get back to you soon!",
        });
        reset();
      }
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="margin-y">
      <div className="containerpaddin container mx-auto py-10 sm:py-0 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Left Side - Contact Form */}
          <div
            data-aos="fade-up"
            data-aos-duration="3000"
            data-aos-delay="100"
            className="flex flex-col pt-0 xl:pt-8 order-2 lg:order-1"
          >
            {/* Success/Error Message */}
            {submitStatus.type && (
              <div
                className={`mb-4 p-4 rounded-lg ${
                  submitStatus.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            {/* Form Fields */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* First Row - First Name and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Image
                      src="/image/contact/form/formlcon/user.png"
                      alt="Person"
                      width={18}
                      height={18}
                      className="w-4 h-4"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="First Name"
                    {...register("firstName")}
                    className={`w-full pl-10 pr-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 ${
                      errors.firstName
                        ? "focus:ring-red-500 ring-2 ring-red-500"
                        : "focus:ring-[#475158]/20"
                    } font-poppins text-base`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Image
                      src="/image/contact/form/formlcon/user.png"
                      alt="Person"
                      width={18}
                      height={18}
                      className="w-4 h-4"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    {...register("lastName")}
                    className={`w-full pl-10 pr-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 ${
                      errors.lastName
                        ? "focus:ring-red-500 ring-2 ring-red-500"
                        : "focus:ring-[#475158]/20"
                    } font-poppins text-base`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone No */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Image
                      src="/image/contact/form/formlcon/phone.png"
                      alt="Phone"
                      width={18}
                      height={18}
                      className="w-4 h-4"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone No"
                    {...register("phone")}
                    className={`w-full pl-10 pr-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? "focus:ring-red-500 ring-2 ring-red-500"
                        : "focus:ring-[#475158]/20"
                    } font-poppins text-base`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Image
                      src="/image/contact/ctloog/mail.png"
                      alt="Email"
                      width={18}
                      height={18}
                      className="w-5 h-5"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className={`w-full pl-10 pr-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 ${
                      errors.email
                        ? "focus:ring-red-500 ring-2 ring-red-500"
                        : "focus:ring-[#475158]/20"
                    } font-poppins text-base`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Message Textarea */}
              <div className="relative">
                <textarea
                  placeholder="Your Message"
                  rows={9}
                  {...register("message")}
                  className={`w-full px-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 ${
                    errors.message
                      ? "focus:ring-red-500 ring-2 ring-red-500"
                      : "focus:ring-[#475158]/20"
                  } font-poppins text-sm resize-none`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mt-4">
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group bg-[#475158] text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex flex-row items-center justify-center">
                    <div className="text-white description px-4 sm:px-3 md:px-5 lg:px-2 xl:px-3 2xl:px-4 font-poppins">
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </div>
                    <div className="text-white text-sm pr-1 py-1">
                      <img
                        src="/image/Icon/Buttonicon.png"
                        alt="arrow-right"
                        width={50}
                        height={50}
                        className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px] lg:w-[30px] lg:h-[30px] xl:w-[40px] xl:h-[40px] 2xl:w-[55px] 2xl:h-[50px]"
                      />
                    </div>
                  </div>
                </button>

                {/* Social Media Icons */}
                <div className="flex flex-row gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 flex items-center justify-center hover:scale-105"
                  >
                    <Image
                      src="/image/contact/form/whatsapp.png"
                      alt="WhatsApp"
                      width={20}
                      height={20}
                      className="w-8 h-8"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/everwood.collection"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center hover:scale-105"
                  >
                    <Image
                      src="/image/contact/form/instagram.png"
                      alt="Instagram"
                      width={20}
                      height={20}
                      className="w-8 h-8"
                    />
                  </a>
                  <a
                    href="https://www.facebook.com/everwoodcollection"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center hover:scale-105"
                  >
                    <Image
                      src="/image/contact/form/facebook.png"
                      alt="Facebook"
                      width={20}
                      height={20}
                      className="w-8 h-8"
                    />
                  </a>
                </div>
              </div>
            </form>
          </div>

          {/* Right Side - Images */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 lg:gap-6 order-1 lg:order-2">
            {/* Top Image */}
            <div
              data-aos="fade-left"
              data-aos-duration="3000"
              className="w-full"
            >
              <Image
                src="/image/contact/form/Rectangle 65.png"
                alt="Modern Living Space"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>

            {/* Bottom Image */}
            <div
              data-aos="fade-left"
              data-aos-duration="3000"
              className="w-full"
            >
              <Image
                src="/image/contact/form/Rectangle 96.png"
                alt="Contemporary Dining Area"
                width={600}
                height={400}
                className="w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
