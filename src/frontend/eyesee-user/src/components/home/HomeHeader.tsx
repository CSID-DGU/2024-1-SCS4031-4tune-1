import LogoIcon from "@/assets/icons/Logo.svg";

const HomeHeader = () => {
  return (
    <div className="px-[6vw] py-[2vh] flex justify-between items-center">
      <LogoIcon />
      <div className="text-[18px] text-white cursor-pointer">About us</div>
    </div>
  );
};

export default HomeHeader;
