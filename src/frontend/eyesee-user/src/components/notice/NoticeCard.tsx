import InfoIcon from "@/assets/icons/InfoIcon.svg";

const NoticeCard = () => {
  return (
    <div className="w-[80vw] mt-8 py-5 rounded-xl bg-[rgba(14,29,60,0.1)]">
      <div className="flex items-center justify-center gap-1 text-black font-semibold text-[14px] text-center mb-3">
        <p>유의사항</p>
        <InfoIcon />
      </div>
      <div className="text-[10px] font-light text-black text-center">
        시험 정보는 시험 감독자(관리자)가 입력한 정보입니다.
        <br />
        아래 기재된 정보와 관련하여 궁금한 사항은
        <br />
        시험장에 상주하는 관리자를 통해 확인하시기 바랍니다.
      </div>
    </div>
  );
};

export default NoticeCard;
