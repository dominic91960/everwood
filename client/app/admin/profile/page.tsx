"use client";

import React from "react";

import Header from "./components/header/Header";
import FormTabs from "./components/form-tabs/FormTabs";

const AdminProfilePage = () => {
  return (
    <section className="relative leading-[1.1]">
      <div className="max-w-7xl text-[13px] sm:text-[14px] md:text-[16px] lg:text-[17px] xl:text-[19px] 2xl:text-[20px]">
        <Header />
        <FormTabs />
      </div>
    </section>
  );
};

export default AdminProfilePage;
