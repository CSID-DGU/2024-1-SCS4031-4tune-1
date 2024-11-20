import { UserInfoRequest } from "@/types/exam";

export const informationValidation = (information: UserInfoRequest) => {
  if (
    information.examCode !== "" &&
    information.name !== "" &&
    information.department !== "" &&
    information.seatNum !== 0 &&
    information.userNum !== 0
  ) {
    return true;
  } else return false;
};
