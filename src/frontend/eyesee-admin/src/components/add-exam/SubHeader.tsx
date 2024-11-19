type SubHeaderProps = {
  title: string;
};

const SubHeader = ({ title }: SubHeaderProps) => {
  return (
    <div className="my-10 border-l-[5px] border-[#0E1D3C] px-6 text-[#0E1D3C] text-[28px] font-semibold">
      {title}
    </div>
  );
};

export default SubHeader;
