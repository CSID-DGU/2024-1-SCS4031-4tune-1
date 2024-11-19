import { api } from ".";
import { RESTYPE } from "@/types/common";
import { UserInfoRequest, UserInfoResponse } from "@/types/exam";

export const userInformation = async (
  data: UserInfoRequest
): Promise<RESTYPE<UserInfoResponse>> => {
  const response = await api.post(`/sessions/student`, data);
  return response.data;
};
