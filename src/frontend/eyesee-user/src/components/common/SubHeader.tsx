type SubHeaderProps = {
  title: string;
};
const SubHeader = ({ title }: SubHeaderProps) => {
  return (
    <div className="text-[20px] font-bold mt-[8vh] ml-[10vw]">{title}</div>
  );
};

export default SubHeader;
