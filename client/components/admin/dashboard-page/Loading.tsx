import React from "react";

const Loading = () => {
  return (
    <section className="flex grow flex-col">
      <h1 className="mb-[0.5em] text-[16px] font-semibold sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] 2xl:text-[36px]">
        Dashboard
      </h1>
      <div className="border-foreground/10 bg-background/5 flex grow items-center justify-center rounded-[1em] border">
        <p className="animate-pulse uppercase">Loading...</p>
      </div>
    </section>
  );
};

export default Loading;
