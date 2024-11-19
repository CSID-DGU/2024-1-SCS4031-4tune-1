import ToggleIcon from "@/assets/icons/ToggleIcon.svg";
import { Dispatch, SetStateAction } from "react";

type CheatingSettingProps = {
  setCheatingModal: Dispatch<SetStateAction<boolean>>;
};
const CheatingSetting = ({ setCheatingModal }: CheatingSettingProps) => {
  return (
    <div
      onClick={() => setCheatingModal(false)}
      className="z-50 fixed w-screen h-screen top-0 left-0 flex justify-center items-center"
    >
      <div className="relative bg-[rgba(14,29,60,0.9)] rounded-[10px] flex flex-col gap-4 px-12 py-16 justify-center">
        {/* 닫기 버튼 */}
        <button
          onClick={() => setCheatingModal(false)}
          className="absolute top-3 right-6 text-white text-[28px]"
        >
          x
        </button>
        {/* 부정행위 유형 */}
        <div className="flex items-center gap-5">
          <ToggleIcon />
          <p className="text-white text-[24px]">
            아래를 보지 않은 상태에서 주변을 5초 이상 응시
          </p>
        </div>
        <div className="flex items-center gap-5">
          <ToggleIcon />
          <p className="text-white text-[24px]">
            30초 이내에 아래를 보지 않은 상태에서 동일한 곳을 3초 이상 5번 응시
          </p>
        </div>
        <div className="flex items-center gap-5">
          <ToggleIcon />
          <p className="text-white text-[24px]">
            스마트폰, 작은 종이(시험지 제외)가 포착
          </p>
        </div>
        <div className="flex items-center gap-5">
          <ToggleIcon />
          <p className="text-white text-[24px]">화면에서 5초 이상 이탈</p>
        </div>
        <div className="flex items-center gap-5">
          <ToggleIcon />
          <p className="text-white text-[24px]">
            30초 이내 화면에서 3초이상 5번 이탈
          </p>
        </div>
        <div className="flex items-center gap-5">
          <ToggleIcon />
          <p className="text-white text-[24px]">친구에게 물건을 전달</p>
        </div>
        <div className="flex items-center gap-5">
          <ToggleIcon />
          <p className="text-white text-[24px]">시험지를 들어서 보여줌</p>
        </div>
        <div className="flex items-center gap-5">
          <ToggleIcon />
          <p className="text-white text-[24px]">특정 손동작을 반복하는 경우</p>
        </div>
        <div className="flex items-center gap-5">
          <ToggleIcon />
          <p className="text-white text-[24px]">
            정면 하단이 아닌 고개를 돌리고 5초 이상 유지
          </p>
        </div>
        <div className="flex items-center gap-5">
          <ToggleIcon />
          <p className="text-white text-[24px]">
            정면 하단을 제외한 특정 위치로 고개를 돌리는 행위를 30초 이내 3초
            이상 5번 수행
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheatingSetting;
