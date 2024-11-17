import { Information } from "@/types/information";

export const informationValidation = (information: Information) => {
  if (
    information.name !== "" &&
    information.major !== "" &&
    information.seatNumber !== 0 &&
    information.studentNumber !== ""
  ) {
    return true;
  } else return false;
};
