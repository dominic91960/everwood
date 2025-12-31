import React from "react";

type StatCardProps = {
  title: string;
  icon: React.ReactNode;
  count: number;
};

const StatCard: React.FC<StatCardProps> = ({ title, icon, count }) => {
  return (
    <article className="rounded-[1em] bg-gradient-to-br from-[#028EFC]/2 to-[#028EFC]/30 p-[1em]">
      <div className="flex items-center justify-between gap-[1em] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px]">
        <p className="font-medium">{title}</p>
        <div className="relative size-[2em] shrink-0 rounded-full bg-gradient-to-b from-[#40A6F7] to-[#028EFC]">
          {icon}
        </div>
      </div>
      <p className="mt-[0.5em] text-[16px] font-medium sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] 2xl:text-[36px]">
        {count}
      </p>
    </article>
  );
};

export default StatCard;
