import HomeContents from "@/components/home/HomeContents";
import HomeNav from "@/components/home/HomeNav";

const HomePage = () => {
  return (
    <div className="bg-bgGradient w-screen h-screen flex flex-col justify-between">
      <HomeNav />
      <HomeContents />
    </div>
  );
};

export default HomePage;
