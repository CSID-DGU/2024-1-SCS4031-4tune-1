"use client";

import { useRouter } from "next/navigation";

type NextButtonProps = {
  action?: string;
  isAvailable: boolean;
  title: string;
  noArrow?: boolean;
};

const NextButton = ({
  action,
  isAvailable,
  title,
  noArrow,
}: NextButtonProps) => {
  const route = useRouter();
  const handleClick = () => {
    if (action) {
      route.push(action);
    }
  };
  return (
    <div
      onClick={handleClick}
      className={`z-50 flex justify-between items-center gap-14 text-white text-[14px] tracking-[4.2px] px-4 py-3 ${
        isAvailable ? "bg-[rgb(14,29,60,0.8)]" : "bg-[rgb(146,146,146,0.8)]"
      }`}
    >
      <div>{title}</div>
      {!noArrow && <div>→</div>}
    </div>
  );
};

export default NextButton;
