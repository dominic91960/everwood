"use client"; // This tells Next.js it's a client component

import React from "react";

import NewStudentTable from "./newblogtable";

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <div className=" flex-1 py-4">
        <NewStudentTable />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
