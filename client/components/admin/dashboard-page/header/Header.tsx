import React from "react";

import { BsFileBarGraphFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";

import StatCard from "./StatCard";

type HeaderProps = {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalEarnings: number;
};

const Header: React.FC<HeaderProps> = ({
  totalProducts,
  totalCustomers,
  totalOrders,
  totalEarnings,
}) => {
  return (
    <section className="leading-[1.1]">
      <h1 className="mb-[1em] text-[16px] font-semibold sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] 2xl:text-[36px]">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 gap-[0.5em] sm:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          title="All Products"
          icon={
            <BsFileBarGraphFill className="absolute inset-0 m-auto size-fit" />
          }
          count={totalProducts}
        />
        <StatCard
          title="All Customers"
          icon={<FaUser className="absolute inset-0 m-auto size-fit" />}
          count={totalCustomers}
        />
        <StatCard
          title="All Orders"
          icon={
            <FaClipboardList className="absolute inset-0 m-auto size-fit" />
          }
          count={totalOrders}
        />
        <StatCard
          title="All Earnings"
          icon={
            <MdAttachMoney className="absolute inset-0 m-auto size-fit text-[1.3em]" />
          }
          count={totalEarnings}
        />
      </div>
    </section>
  );
};

export default Header;
