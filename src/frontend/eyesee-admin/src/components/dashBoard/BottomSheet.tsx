import { useState } from "react";

type BottomSheetProps = {
  onClick: () => void;
};

const BottomSheet = ({ onClick }: BottomSheetProps) => {
  const [isVisible, setIsVisible] = useState(true); // 현재 BottomSheet의 상태

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClick();
    }, 70);
  };

  return (
    <div
      onClick={handleClose} // 클릭 시 닫히는 동작
      className={`cursor-pointer z-20 absolute bottom-0 w-full flex flex-col py-[4px] justify-center items-center bg-black rounded-t-xl shadow-dashboordShadow transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="text-[10px] font-semibold text-white">
        수험자를 확인했어요
      </div>
      <p className="text-[#C4C4C4] text-[8px]">
        클릭하면 강조 표시가 사라집니다!
      </p>
    </div>
  );
};

export default BottomSheet;
