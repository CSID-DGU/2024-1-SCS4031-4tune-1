"use client";

import Navbar from "@/components/common/Navbar";
import SigninInput from "@/components/signin/SigninInput";
import { useSignin } from "@/hooks/api/useAuth";
import { SigninRequest } from "@/types/auth";
import React, { useState } from "react";

const SigninPage = () => {
  const [signinData, setSigninData] = useState<SigninRequest>({
    adminEmail: "",
    password: "",
  });

  const { mutate } = useSignin();

  const handleSubmit = () => {
    mutate(signinData);
  };

  return (
    <div className="bg-bgGradient w-screen min-h-screen flex flex-col items-center">
      {/* Navbar */}
      <Navbar bgColr="bg-black" />
      <SigninInput
        signinData={signinData}
        setSigninData={setSigninData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SigninPage;
