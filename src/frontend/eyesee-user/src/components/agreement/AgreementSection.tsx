import { Agreements } from "@/types/agreements";
import { Dispatch, SetStateAction } from "react";

type AgreementSectionProps = {
  agreements: Agreements;
  setAgreements: Dispatch<SetStateAction<Agreements>>;
};

const AgreementSection = ({
  agreements,
  setAgreements,
}: AgreementSectionProps) => {
  const handleIndividualChange = (key: keyof Agreements) => {
    setAgreements((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      const allChecked = updated.personalInfo && updated.thirdParty;
      return { ...updated, all: allChecked };
    });
  };

  const handleAllChange = () => {
    setAgreements((prev) => {
      const newValue = !prev.all;
      return {
        all: newValue,
        personalInfo: newValue,
        thirdParty: newValue,
      };
    });
  };

  return (
    <div className="flex flex-col gap-4 pt-10 px-[10vw]">
      <div className="text-lg font-semibold">개인정보 수집 · 이용 동의</div>
      <div className="text-xs">
        휴대폰 카메라를 활용한 ‘대면 시험 부정행위 감독’을 위하여 수험자 정보
        수집 · 이용합니다.
        <br />
        1. 개인정보 수집 목적: 회원관리, 고객 상담, 주의사항 전달
        <br />
        2. 개인정보 수집 항목: 이름, 학과, 학번, 생년월일, 이메일
        <br />
        3. 보유 및 이용기간: 시험 삭제 시까지
        <br />※ 개인정보 수집 및 이용에 동의하지 않을 권리가 있으며, 동의를
        거부할 경우에는 서비스 이용이 불가합니다.
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={agreements.personalInfo}
          onChange={() => handleIndividualChange("personalInfo")}
        />
        <label>위 개인정보 수집 · 이용에 동의합니다. (필수)</label>
      </div>

      <div className="text-lg font-semibold">개인정보 제3자 제공 동의</div>
      <div className="text-xs">
        대면 시험 부정행위 감독 서비스 “EYESee”는 회원님의 개인정보를 개인정보
        처리방침에서 고지한 제3자 제공 범위 내에서 제공하며, 정보주체의 사전
        동의 없이 동 범위를 초과하여 제3자에게 제공하지 않습니다.
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={agreements.thirdParty}
          onChange={() => handleIndividualChange("thirdParty")}
        />
        <label>위 개인정보 제3자 제공 동의합니다. (선택)</label>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          checked={agreements.all}
          onChange={handleAllChange}
        />
        <label>전체 동의하기</label>
      </div>
    </div>
  );
};

export default AgreementSection;
