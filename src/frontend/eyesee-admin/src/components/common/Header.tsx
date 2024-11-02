import React from "react";

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="border border-[##0E1D3C] px-5 text-[#0E1D3C] text-2xl font-semibold">
      {title}
    </div>
  );
};

export default Header;
