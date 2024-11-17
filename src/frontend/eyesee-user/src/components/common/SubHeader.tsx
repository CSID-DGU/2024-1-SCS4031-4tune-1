type SubHeaderProps = {
  title: string;
};
const SubHeader = ({ title }: SubHeaderProps) => {
  return (
    <div className="text-black text-[20px] font-bold pt-[8vh] pl-[10vw]">
      {title}
    </div>
  );
};

export default SubHeader;
