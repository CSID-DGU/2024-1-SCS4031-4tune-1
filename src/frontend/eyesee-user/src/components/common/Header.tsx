"use client";

import LogoIcon from "@/assets/icons/Logo.svg";
import MenuIcon from "@/assets/icons/MenuIcon.svg";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/" && (
        <div className="px-[6vw] py-[2vh] flex justify-between items-center bg-[#0E1D3C]">
          <LogoIcon />
          <MenuIcon />
        </div>
      )}
    </>
  );
};

export default Header;
