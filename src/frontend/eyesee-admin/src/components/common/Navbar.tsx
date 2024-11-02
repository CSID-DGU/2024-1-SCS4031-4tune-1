"use client";

import { useRouter } from "next/navigation";
import Logo from "@/assets/images/logo.svg";
import Profile from "@/assets/icons/Profile.svg";

type NavbarProps = {
  bgColr: string;
};

const Navbar = ({ bgColr }: NavbarProps) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className={`${bgColr} flex w-screen h-32 items-center justify-between px-12`}
    >
      <div>
        <Logo />
      </div>
      <div className="flex justify-between gap-16">
        <button className="text-2xl text-white">About us</button>
        <Profile />
        {/* <button
          onClick={() => handleNavigation("/signin")}
          className="text-2xl"
        >
          Sign in
        </button> */}
      </div>
    </div>
  );
};

export default Navbar;
