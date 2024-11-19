import { api, apiWithoutAuth } from ".";
import { RESTYPE } from "@/types/common";
import { SignupRequest, SignupResponse } from "@/types/auth";

export const signup = async (
  data: SignupRequest
): Promise<RESTYPE<SignupResponse>> => {
  const response = await apiWithoutAuth.post(`/admins/signup`, data);
  return response.data;
};
