import HomeHeader from "@/components/home/HomeHeader";
import Explain from "@/assets/icons/Explain.svg";
import HomeCta from "@/components/home/HomeCta";

const HomePage = () => {
  return (
    <div className="bg-bgGradient w-screen h-screen flex flex-col justify-between">
      <HomeHeader />
      <div className="mb-[10vh]">
        <Explain className="mx-[8vw] mb-[12vh]" />
        <HomeCta />
      </div>
    </div>
  );
};

export default HomePage;
