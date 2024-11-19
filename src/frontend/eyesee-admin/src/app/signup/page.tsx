"use client";

import Navbar from "@/components/common/Navbar";
import SignupInput from "@/components/signup/SignupInput";
import { useSignup } from "@/hooks/api/useAuth";
import { SignupRequest } from "@/types/auth";
import { signupValidation } from "@/utils/validation";
import React, { useState } from "react";

const SignupPage = () => {
  const [signupData, setSignupData] = useState<SignupRequest>({
    adminEmail: "",
    adminName: "",
    password: "",
    passwordConfirm: "",
  });
  const { mutate } = useSignup();

  const handleSubmit = () => {
    // 회원가입 유효성 검사
    if (signupValidation(signupData)) {
      mutate(signupData);
    }
  };

  return (
    <div className="bg-bgGradient w-screen min-h-screen flex flex-col items-center">
      {/* Navbar */}
      <Navbar bgColr="bg-black" hasMenu={false} />

      {/* Signup Section */}
      <SignupInput
        signupData={signupData}
        setSignupData={setSignupData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SignupPage;
