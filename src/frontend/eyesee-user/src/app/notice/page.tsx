import NextButton from "@/components/common/NextButton";
import SubHeader from "@/components/common/SubHeader";
import ExamCard from "@/components/notice/ExamCard";
import NoticeCard from "@/components/notice/NoticeCard";

const NoticePage = () => {
  return (
    <div>
      <SubHeader title="시험 유의사항" />
      <div className="flex flex-col items-center">
        <NoticeCard />
        <ExamCard />
      </div>
      <div className="fixed bottom-6 right-0">
        <NextButton title="NEXT" isAvailable={true} action="/agreement" />
      </div>
    </div>
  );
};

export default NoticePage;
