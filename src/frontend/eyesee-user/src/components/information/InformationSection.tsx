import { Information } from "@/types/information";
import { Dispatch, SetStateAction } from "react";

type InformationSectionProps = {
  information: Information;
  setInformation: Dispatch<SetStateAction<Information>>;
};

const InformationSection = ({
  information,
  setInformation,
}: InformationSectionProps) => {
  const handleChange = (key: keyof Information, value: string) => {
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
          value={information.major}
          onChange={(e) => handleChange("major", e.target.value)}
          className="w-full text-[#141412] text-[14px] px-3 py-3 border-b border-black"
        />
      </div>

      <div>
        <label htmlFor="name" className="block mb-2">
          학번
        </label>
        <input
          id="studentId"
          type="text"
          placeholder="학번"
          value={information.studentNumber}
          onChange={(e) => handleChange("studentNumber", e.target.value)}
          className="w-full text-[#141412] text-[14px] px-3 py-3 border-b border-black"
        />
      </div>

      <div>
        <label htmlFor="name" className="block mb-2">
          좌석 번호
        </label>
        <input
          id="seatNumber"
          type="text"
          placeholder="좌석 번호"
          value={information.seatNumber}
          onChange={(e) => handleChange("seatNumber", e.target.value)}
          className="w-full text-[#141412] text-[14px] px-3 py-3 border-b border-black"
        />
      </div>
    </div>
  );
};

export default InformationSection;
