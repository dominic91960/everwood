"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";
import { GiPartyPopper } from "react-icons/gi";
import { VscBracketError } from "react-icons/vsc";
import { IoInformationSharp } from "react-icons/io5";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "bg-black/30 font-primary z-[999] flex w-fit max-w-fit items-center gap-[0.4em] rounded-full border-none px-[1em] py-[0.5em] text-[16px] backdrop-blur-sm sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[23px] 2xl:text-[24px]",
          title: "text-black font-light whitespace-nowrap",
          icon: "text-black text-[1.3em]",
        },
      }}
      icons={{
        success: <GiPartyPopper className="text-success" />,
        error: <VscBracketError className="text-destructive" />,
        info: <IoInformationSharp className="text-black" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
