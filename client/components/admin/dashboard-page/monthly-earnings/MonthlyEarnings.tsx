"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  TooltipContentProps,
  Rectangle,
} from "recharts";
import { TbError404 } from "react-icons/tb";

type MonthlyEarningsProps = {
  monthlyEarnings: { date: string; earnings: number }[];
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<string | number, string>) => {
  const isVisible = active && payload && payload.length;
  return (
    <div
      className="bg-foreground/5 border-foreground/10 rounded-[1em] border p-[1em] text-[11px] backdrop-blur-sm sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {isVisible && (
        <>
          <p className="label">{label}</p>
          <p className="desc">Total Earnings: Rs.{payload[0].value}</p>
        </>
      )}
    </div>
  );
};

const MonthlyEarnings: React.FC<MonthlyEarningsProps> = ({
  monthlyEarnings,
}) => {
  const [displayedData, setDisplayedData] = useState(
    monthlyEarnings.reverse().slice(0, 4).reverse(),
  );

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      let sliceIndex = 4;

      if (screenWidth < 640) sliceIndex = 4;
      else if (screenWidth < 1280) sliceIndex = 6;
      else if (screenWidth < 1536) sliceIndex = 5;

      setDisplayedData(
        monthlyEarnings.reverse().slice(0, sliceIndex).reverse(),
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [monthlyEarnings]);

  return (
    <div className="rounded-[1em] bg-[#028EFC]/10 p-[1em]">
      <p className="mb-[1em] text-[12px] font-medium sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px]">
        Monthly Earnings
      </p>
      {displayedData.length > 0 && (
        <BarChart
          key={displayedData.length}
          style={{
            width: "100%",
          }}
          responsive
          data={displayedData}
          className="text-foreground/70 aspect-[10/5] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]"
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#028EFC" />
              <stop offset="100%" stopColor="#0066B5" />
            </linearGradient>
            <filter
              id="activeBarGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="3"
                floodColor="var(--foreground)"
                floodOpacity="0.3"
              />
            </filter>
          </defs>

          <XAxis dataKey="date" axisLine={false} tickLine={false} />
          <Tooltip content={CustomTooltip} cursor={{ fill: "none" }} />
          <Bar
            dataKey="earnings"
            fill="url(#barGradient)"
            radius={10}
            opacity={0.5}
            activeBar={
              <Rectangle
                fill="url(#barGradient)"
                opacity={1}
                filter="url(#activeBarGlow)"
              />
            }
            maxBarSize={80}
          />
        </BarChart>
      )}
      {displayedData.length === 0 && (
        <div className="border-foreground/10 bg-background/5 flex aspect-[10/5] grow flex-col items-center justify-center rounded-[1em] border xl:aspect-[10/4] 2xl:sm:aspect-[10/5]">
          <TbError404 className="text-[2em]" />
          <p className="mt-[0.5em] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]">
            No income data available right now.
          </p>
        </div>
      )}
    </div>
  );
};

export default MonthlyEarnings;
