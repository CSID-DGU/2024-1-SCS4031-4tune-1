import { UserInfoRequest } from "@/types/exam";
import { Dispatch, SetStateAction } from "react";

type InformationSectionProps = {
  information: UserInfoRequest;
  setInformation: Dispatch<SetStateAction<UserInfoRequest>>;
};

const InformationSection = ({
  information,
  setInformation,
}: InformationSectionProps) => {
  const handleChange = (key: keyof UserInfoRequest, value: string) => {
    setInformation((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-4 px-[10vw] pt-10">
      <div>
        <label htmlFor="name" className="block">
          이름
        </label>
        <input
          id="name"
          type="text"
          placeholder="이름"
          value={information.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full text-[#141412] text-[14px] px-3 py-3 border-b border-black"
        />
      </div>

      <div>
        <label htmlFor="name" className="block mb-2">
          학과
        </label>
        <input
          id="department"
          type="text"
          placeholder="학과"
          value={information.department}
          onChange={(e) => handleChange("department", e.target.value)}
          className="w-full text-[#141412] text-[14px] px-3 py-3 border-b border-black"
        />
      </div>

      <div>
        <label htmlFor="name" className="block mb-2">
          학번
        </label>
        <input
          id="userNum"
          type="text"
          placeholder="학번"
          value={information.userNum == 0 ? "" : information.userNum}
          onChange={(e) => handleChange("userNum", e.target.value)}
          className="w-full text-[#141412] text-[14px] px-3 py-3 border-b border-black"
        />
      </div>

      <div>
        <label htmlFor="name" className="block mb-2">
          좌석 번호
        </label>
        <input
          id="seatNum"
          type="text"
          placeholder="좌석 번호"
          value={information.seatNum == 0 ? "" : information.seatNum}
          onChange={(e) => handleChange("seatNum", e.target.value)}
          className="w-full text-[#141412] text-[14px] px-3 py-3 border-b border-black"
        />
      </div>
    </div>
  );
};

export default InformationSection;
