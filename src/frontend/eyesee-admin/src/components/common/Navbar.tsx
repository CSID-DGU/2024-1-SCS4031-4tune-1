"use client";

import { useRouter } from "next/navigation";
import Logo from "@/assets/images/logo.svg";
import Profile from "@/assets/icons/Profile.svg";
import { useEffect, useState } from "react";
import { getAccessToken } from "@/utils/auth";

type NavbarProps = {
  bgColr: string;
  hasMenu: boolean;
};

const Navbar = ({ bgColr, hasMenu }: NavbarProps) => {
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const [isSignin, setIsSignin] = useState(false);

  // 로그인 여부 확인
  useEffect(() => {
    if (getAccessToken()) {
      setIsSignin(true);
    }
  }, []);

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
            {isSignin ? (
              <Profile onClick={() => router.push("/mypage")} />
            ) : (
              <button
                onClick={() => handleNavigation("/signin")}
                className="text-2xl text-white"
              >
                Sign in
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
