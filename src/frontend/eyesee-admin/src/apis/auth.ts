import { api, apiWithoutAuth } from ".";
import { RESTYPE } from "@/types/common";
import {
  SigninRequest,
  SigninResponse,
  SignupRequest,
  SignupResponse,
} from "@/types/auth";

export const signup = async (
  data: SignupRequest
): Promise<RESTYPE<SignupResponse>> => {
  const response = await apiWithoutAuth.post(`/admins/signup`, data);
  return response.data;
};

export const signin = async (
  data: SigninRequest
): Promise<RESTYPE<SigninResponse>> => {
  const response = await apiWithoutAuth.post(`/admins/login`, data);
  return response.data;
};
