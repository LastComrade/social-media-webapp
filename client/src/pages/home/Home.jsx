// CSS
import "./home.css";

// Components
import TopBar from "components/topbar/TopBar";
import LeftBar from "components/leftbar/LeftBar";
import Feed from "components/feed/Feed";
import RightBar from "components/rightbar/RightBar";

function Home() {
  return (
    <>
      <TopBar />
      <div className="relative bg-gradient-to-r from-rose-100 to-teal-100 flex width-full">
        <LeftBar />
        <Feed />
        <RightBar />
      </div>
    </>
  );
}

export default Home;
