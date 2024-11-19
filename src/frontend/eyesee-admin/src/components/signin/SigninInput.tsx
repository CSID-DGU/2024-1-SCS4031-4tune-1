import React, { Dispatch, SetStateAction } from "react";
import EmailIcon from "@/assets/icons/EmailIcon.svg";
import PasswordIcon from "@/assets/icons/PasswordIcon.svg";
import { useRouter } from "next/navigation";
import { SigninRequest } from "@/types/auth";

type SigninInputProps = {
  signinData: SigninRequest;
  setSigninData: Dispatch<SetStateAction<SigninRequest>>;
  onSubmit: () => void;
};

const SigninInput = ({
  signinData,
  setSigninData,
  onSubmit,
}: SigninInputProps) => {
  const router = useRouter();

  return (
    <div className="relative bg-[rgba(255,255,255,0.3)] px-[10vw] rounded-2xl w-[60vw] h-[80vh] flex flex-col justify-center items-center">
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
              value={signinData.adminEmail}
              onChange={(e) =>
                setSigninData({ ...signinData, adminEmail: e.target.value })
              }
              className="flex-1 bg-transparent text-[#444] text-xl outline-none placeholder-[#757575]"
            />
          </div>
          {/* password */}
          <div className="flex items-center px-12 py-6 bg-[rgba(255,255,255,0.7)] rounded-full border border-[#8c8c8c]">
            <PasswordIcon className="mr-4" />
            <input
              type="password"
              placeholder="Password"
              value={signinData.password}
              onChange={(e) =>
                setSigninData({ ...signinData, password: e.target.value })
              }
              className="flex-1 bg-transparent text-[#444] text-xl outline-none placeholder-[#757575]"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="absolute bottom-8 right-10 text-[36px] mt-8 w-[70px] h-[70px] bg-black text-white text-xl font-semibold rounded-full hover:bg-gray-800 transition-all"
      >
        〉
      </button>
    </div>
  );
};

export default SigninInput;
