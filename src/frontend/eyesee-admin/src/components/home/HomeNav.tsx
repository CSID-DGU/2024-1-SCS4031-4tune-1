"use client";

import { useRouter } from "next/navigation";
import Logo from "@/assets/images/logo.svg";

const HomeNav = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-[#141412] flex h-32 items-center justify-between px-12">
      <div>
        <Logo />
      </div>
      <div className="flex justify-between gap-16">
        <button className="text-2xl">About us</button>
        <button
          onClick={() => handleNavigation("/signin")}
          className="text-2xl"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default HomeNav;
