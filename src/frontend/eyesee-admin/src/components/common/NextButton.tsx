type NextButtonProps = {
  title: string;
  onClick: () => void;
};
const NextButton = ({ title, onClick }: NextButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-10 right-0 text-white text-[20px] tracking-[6px] px-8 py-5 bg-[rgba(14,29,60,0.8)] flex items-center gap-[120px]"
    >
      <div>{title}</div>
      <div>→</div>
    </button>
  );
};

export default NextButton;
