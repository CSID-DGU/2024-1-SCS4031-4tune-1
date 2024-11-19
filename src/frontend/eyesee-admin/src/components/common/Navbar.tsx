"use client";

import { useRouter } from "next/navigation";
import Logo from "@/assets/images/logo.svg";
import Profile from "@/assets/icons/Profile.svg";

type NavbarProps = {
  bgColr: string;
  hasMenu?: boolean;
};

const Navbar = ({ bgColr, hasMenu }: NavbarProps) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className={`${bgColr} flex w-screen h-[12vh] items-center justify-between px-12`}
    >
      <div>
        <Logo onClick={() => handleNavigation("/")} />
      </div>
      <div className="flex justify-between gap-16">
        {hasMenu && (
          <>
            <button className="text-2xl text-white">About us</button>
            <Profile />
            {/* <button
          onClick={() => handleNavigation("/signin")}
          className="text-2xl"
        >
          Sign in
        </button> */}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
