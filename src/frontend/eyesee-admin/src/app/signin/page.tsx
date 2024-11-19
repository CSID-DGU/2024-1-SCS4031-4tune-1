"use client";

import EmailIcon from "@/assets/icons/EmailIcon.svg";
import PasswordIcon from "@/assets/icons/PasswordIcon.svg";
import Navbar from "@/components/common/Navbar";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SigninPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-bgGradient w-screen min-h-screen flex flex-col items-center">
      {/* Navbar */}
      <Navbar bgColr="bg-black" />

      <div className="relative bg-[rgba(255,255,255,0.3)] px-[10vw] rounded-2xl w-[80vw] h-[80vh] flex flex-col justify-center items-center">
        <button
          onClick={() => router.push("/signup")}
          className="absolute top-8 right-10 text-xl text-[#d1d1d1] cursor-pointer"
        >
          Sign up
        </button>

        <div className="flex flex-col gap-[10vh] w-full">
          <h1 className="text-4xl md:text-[80px] font-semibold text-black mb-8">
            Sign in
          </h1>

          <div className="space-y-6">
            {/* email */}
            <div className="flex items-center px-12 py-6 bg-[rgba(255,255,255,0.7)] rounded-full border border-[#8c8c8c]">
              <EmailIcon className="mr-4" />
              <input
                type="text"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-[#444] text-xl outline-none placeholder-[#757575]"
              />
            </div>
            {/* password */}
            <div className="flex items-center px-12 py-6 bg-[rgba(255,255,255,0.7)] rounded-full border border-[#8c8c8c]">
              <PasswordIcon className="mr-4" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent text-[#444] text-xl outline-none placeholder-[#757575]"
              />
            </div>
          </div>
        </div>

        <button className="absolute bottom-8 right-10 text-[36px] mt-8 w-[70px] h-[70px] bg-black text-white text-xl font-semibold rounded-full hover:bg-gray-800 transition-all">
          〉
        </button>
      </div>
    </div>
  );
};

export default SigninPage;
