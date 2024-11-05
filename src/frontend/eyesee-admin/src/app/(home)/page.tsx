import Navbar from "@/components/common/Navbar";
import HomeContents from "@/components/home/HomeContents";

const HomePage = () => {
  return (
    <div className="bg-bgGradient w-screen h-screen flex flex-col justify-between">
      <Navbar bgColr="bg-[#141412]" />
      <HomeContents />
    </div>
  );
};

export default HomePage;
