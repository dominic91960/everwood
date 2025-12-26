import React from "react";

import { VscBracketError } from "react-icons/vsc";

const Error = () => {
  return (
    <section className="flex grow flex-col">
      <h1 className="mb-[0.5em] text-[16px] font-semibold sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] 2xl:text-[36px]">
        Dashboard
      </h1>
      <div className="border-foreground/10 bg-background/5 flex grow flex-col items-center justify-center rounded-[1em] border">
        <VscBracketError className="text-[3em]" />
        <p>Unable to load dashboard information.</p>
        <p className="mt-[0.5em] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]">
          We’re working on it. Please try again shortly.
        </p>
      </div>
    </section>
  );
};

export default Error;
